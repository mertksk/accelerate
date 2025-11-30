#![allow(clippy::field_reassign_with_default)]

#[cfg(feature = "json-schema")]
use alloc::string::String;
use alloc::vec::Vec;
use core::fmt::{self, Display, Formatter};

#[cfg(feature = "datasize")]
use datasize::DataSize;
#[cfg(feature = "json-schema")]
use schemars::{gen::SchemaGenerator, schema::Schema, JsonSchema};
use serde::{Deserialize, Deserializer, Serialize, Serializer};

use crate::{
    bytesrepr::{self, Bytes, FromBytes, ToBytes, U32_SERIALIZED_LENGTH},
    CLType, CLTyped,
};

/// Error while converting a [`CLValue`] into a given type.
#[derive(PartialEq, Eq, Clone, Debug)]
#[cfg_attr(feature = "datasize", derive(DataSize))]
pub struct CLTypeMismatch {
    /// The [`CLType`] into which the `CLValue` was being converted.
    pub expected: CLType,
    /// The actual underlying [`CLType`] of this `CLValue`, i.e. the type from which it was
    /// constructed.
    pub found: CLType,
}

impl Display for CLTypeMismatch {
    fn fmt(&self, f: &mut Formatter) -> fmt::Result {
        write!(
            f,
            "Expected {:?} but found {:?}.",
            self.expected, self.found
        )
    }
}

/// Error relating to [`CLValue`] operations.
#[derive(PartialEq, Eq, Clone, Debug)]
#[cfg_attr(feature = "datasize", derive(DataSize))]
pub enum CLValueError {
    /// An error while serializing or deserializing the underlying data.
    Serialization(bytesrepr::Error),
    /// A type mismatch while trying to convert a [`CLValue`] into a given type.
    Type(CLTypeMismatch),
}

impl From<bytesrepr::Error> for CLValueError {
    fn from(error: bytesrepr::Error) -> Self {
        CLValueError::Serialization(error)
    }
}

impl Display for CLValueError {
    fn fmt(&self, formatter: &mut Formatter) -> fmt::Result {
        match self {
            CLValueError::Serialization(error) => write!(formatter, "CLValue error: {}", error),
            CLValueError::Type(error) => write!(formatter, "Type mismatch: {}", error),
        }
    }
}

/// A Casper value, i.e. a value which can be stored and manipulated by smart contracts.
///
/// It holds the underlying data as a type-erased, serialized `Vec<u8>` and also holds the
/// [`CLType`] of the underlying data as a separate member.
#[derive(PartialEq, Eq, PartialOrd, Ord, Hash, Clone, Debug)]
#[cfg_attr(feature = "datasize", derive(DataSize))]
pub struct CLValue {
    cl_type: CLType,
    bytes: Bytes,
}

impl CLValue {
    /// Constructs a `CLValue` from `t`.
    pub fn from_t<T: CLTyped + ToBytes>(t: T) -> Result<CLValue, CLValueError> {
        let bytes = t.into_bytes()?;

        Ok(CLValue {
            cl_type: T::cl_type(),
            bytes: bytes.into(),
        })
    }

    /// Consumes and converts `self` back into its underlying type.
    pub fn into_t<T: CLTyped + FromBytes>(self) -> Result<T, CLValueError> {
        let expected = T::cl_type();

        if self.cl_type == expected {
            Ok(bytesrepr::deserialize(self.bytes.into())?)
        } else {
            Err(CLValueError::Type(CLTypeMismatch {
                expected,
                found: self.cl_type,
            }))
        }
    }

    /// A convenience method to create CLValue for a unit.
    pub fn unit() -> Self {
        CLValue::from_components(CLType::Unit, Vec::new())
    }

    // This is only required in order to implement `TryFrom<state::CLValue> for CLValue` (i.e. the
    // conversion from the Protobuf `CLValue`) in a separate module to this one.
    #[doc(hidden)]
    pub fn from_components(cl_type: CLType, bytes: Vec<u8>) -> Self {
        Self {
            cl_type,
            bytes: bytes.into(),
        }
    }

    // This is only required in order to implement `From<CLValue> for state::CLValue` (i.e. the
    // conversion to the Protobuf `CLValue`) in a separate module to this one.
    #[doc(hidden)]
    pub fn destructure(self) -> (CLType, Bytes) {
        (self.cl_type, self.bytes)
    }

    /// The [`CLType`] of the underlying data.
    pub fn cl_type(&self) -> &CLType {
        &self.cl_type
    }

    /// Returns a reference to the serialized form of the underlying value held in this `CLValue`.
    pub fn inner_bytes(&self) -> &Vec<u8> {
        self.bytes.inner_bytes()
    }

    /// Returns the length of the `Vec<u8>` yielded after calling `self.to_bytes()`.
    ///
    /// Note, this method doesn't actually serialize `self`, and hence is relatively cheap.
    pub fn serialized_length(&self) -> usize {
        self.cl_type.serialized_length() + U32_SERIALIZED_LENGTH + self.bytes.len()
    }
}

impl ToBytes for CLValue {
    fn to_bytes(&self) -> Result<Vec<u8>, bytesrepr::Error> {
        self.clone().into_bytes()
    }

    fn into_bytes(self) -> Result<Vec<u8>, bytesrepr::Error> {
        let mut result = self.bytes.into_bytes()?;
        self.cl_type.append_bytes(&mut result)?;
        Ok(result)
    }

    fn serialized_length(&self) -> usize {
        self.bytes.serialized_length() + self.cl_type.serialized_length()
    }
}

impl FromBytes for CLValue {
    fn from_bytes(bytes: &[u8]) -> Result<(Self, &[u8]), bytesrepr::Error> {
        let (bytes, remainder) = FromBytes::from_bytes(bytes)?;
        let (cl_type, remainder) = FromBytes::from_bytes(remainder)?;
        let cl_value = CLValue { cl_type, bytes };
        Ok((cl_value, remainder))
    }
}

impl Serialize for CLValue {
    fn serialize<S: Serializer>(&self, serializer: S) -> Result<S::Ok, S::Error> {
        (&self.cl_type, &self.bytes).serialize(serializer)
    }
}

impl<'de> Deserialize<'de> for CLValue {
    fn deserialize<D: Deserializer<'de>>(deserializer: D) -> Result<Self, D::Error> {
        let (cl_type, bytes): (CLType, Bytes) = Deserialize::deserialize(deserializer)?;
        Ok(CLValue { cl_type, bytes })
    }
}

/// Minimal JSON schema to avoid pulling in JSON parsing helpers. Represented as a tuple of
/// `(CLType, bytes)` when the `json-schema` feature is enabled.
#[cfg(feature = "json-schema")]
impl JsonSchema for CLValue {
    fn schema_name() -> String {
        "CLValue".to_string()
    }

    fn json_schema(gen: &mut SchemaGenerator) -> Schema {
        <(CLType, Vec<u8>)>::json_schema(gen)
    }
}
