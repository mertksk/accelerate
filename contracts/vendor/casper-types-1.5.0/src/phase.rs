// Can be removed once https://github.com/rust-lang/rustfmt/issues/3362 is resolved.
#[rustfmt::skip]
use alloc::vec;
use alloc::vec::Vec;

// use num_derive::{FromPrimitive, ToPrimitive};
// use num_traits::{FromPrimitive, ToPrimitive};

use crate::{
    bytesrepr::{Error, FromBytes, ToBytes},
    CLType, CLTyped,
};

/// The number of bytes in a serialized [`Phase`].
pub const PHASE_SERIALIZED_LENGTH: usize = 1;

/// The phase in which a given contract is executing.
#[derive(Debug, PartialEq, Eq, Clone, Copy)]
#[repr(u8)]
pub enum Phase {
    /// Set while committing the genesis or upgrade configurations.
    System = 0,
    /// Set while executing the payment code of a deploy.
    Payment = 1,
    /// Set while executing the session code of a deploy.
    Session = 2,
    /// Set while finalizing payment at the end of a deploy.
    FinalizePayment = 3,
}

impl Phase {
    pub fn to_u8(&self) -> Option<u8> {
        Some(*self as u8)
    }
    pub fn from_u8(id: u8) -> Option<Self> {
        match id {
            0 => Some(Phase::System),
            1 => Some(Phase::Payment),
            2 => Some(Phase::Session),
            3 => Some(Phase::FinalizePayment),
            _ => None,
        }
    }
}

impl ToBytes for Phase {
    fn to_bytes(&self) -> Result<Vec<u8>, Error> {
        // NOTE: Assumed safe as [`Phase`] is represented as u8.
        let id = self.to_u8().expect("Phase is represented as a u8");

        Ok(vec![id])
    }

    fn serialized_length(&self) -> usize {
        PHASE_SERIALIZED_LENGTH
    }
}

impl FromBytes for Phase {
    fn from_bytes(bytes: &[u8]) -> Result<(Self, &[u8]), Error> {
        let (id, rest) = u8::from_bytes(bytes)?;
        let phase = Phase::from_u8(id).ok_or(Error::Formatting)?;
        Ok((phase, rest))
    }
}

impl CLTyped for Phase {
    fn cl_type() -> CLType {
        CLType::U8
    }
}
