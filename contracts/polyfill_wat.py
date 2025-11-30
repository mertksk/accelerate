import sys
import re

def polyfill_wat(wat_path, output_path):
    with open(wat_path, 'r') as f:
        content = f.read()

    # 1. Check if memory.copy/fill exist
    has_copy = 'memory.copy' in content
    has_fill = 'memory.fill' in content

    if not has_copy and not has_fill:
        print("No bulk memory operations found.")
        with open(output_path, 'w') as f:
            f.write(content)
        return

    print(f"Found bulk memory ops: Copy={has_copy}, Fill={has_fill}")

    # 2. Inject Polyfills
    
    # Robust memcpy (handles overlap like memmove)
    memcpy_func = """
  (func $memcpy (param $dest i32) (param $src i32) (param $len i32)
    (local $i i32)
    
    (if (i32.gt_u (local.get $dest) (local.get $src))
      (then
        ;; Backward copy (dest > src)
        (local.set $i (local.get $len))
        (block $done_back
          (loop $loop_back
            (br_if $done_back (i32.eqz (local.get $i)))
            (local.set $i (i32.sub (local.get $i) (i32.const 1)))
            (i32.store8
              (i32.add (local.get $dest) (local.get $i))
              (i32.load8_u (i32.add (local.get $src) (local.get $i)))
            )
            (br $loop_back)
          )
        )
      )
      (else
        ;; Forward copy (dest <= src)
        (local.set $i (i32.const 0))
        (block $done_fwd
          (loop $loop_fwd
            (br_if $done_fwd (i32.ge_u (local.get $i) (local.get $len)))
            (i32.store8
              (i32.add (local.get $dest) (local.get $i))
              (i32.load8_u (i32.add (local.get $src) (local.get $i)))
            )
            (local.set $i (i32.add (local.get $i) (i32.const 1)))
            (br $loop_fwd)
          )
        )
      )
    )
  )
"""

    memset_func = """
  (func $memset (param $dest i32) (param $val i32) (param $len i32)
    (local $i i32)
    (local.set $i (i32.const 0))
    (block $done
      (loop $loop
        (br_if $done (i32.ge_u (local.get $i) (local.get $len)))
        (i32.store8
          (i32.add (local.get $dest) (local.get $i))
          (local.get $val)
        )
        (local.set $i (i32.add (local.get $i) (i32.const 1)))
        (br $loop)
      )
    )
  )
"""

    # Find the end of the module (last ')')
    last_paren_idx = content.rfind(')')
    if last_paren_idx == -1:
        raise Exception("Invalid WAT file")

    injected_code = ""
    if has_copy:
        injected_code += memcpy_func
    if has_fill:
        injected_code += memset_func

    new_content = content[:last_paren_idx] + injected_code + content[last_paren_idx:]

    # 3. Replace Instructions
    if has_copy:
        # Regex to replace `memory.copy` or `memory.copy 0 0` with `call $memcpy`
        new_content = re.sub(r'memory\.copy(\s+0\s+0)?', 'call $memcpy', new_content)

    if has_fill:
        # memory.fill 0
        new_content = re.sub(r'memory\.fill(\s+0)?', 'call $memset', new_content)

    with open(output_path, 'w') as f:
        f.write(new_content)

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python3 polyfill_wat.py <input.wat> <output.wat>")
        sys.exit(1)
    
    polyfill_wat(sys.argv[1], sys.argv[2])