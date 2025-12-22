(module
  (type (;0;) (func (param i32 i32 i32 i32)))
  (type (;1;) (func (param i32 i32) (result i32)))
  (type (;2;) (func (param i32) (result i32)))
  (type (;3;) (func (param i32 i32 i32 i32) (result i32)))
  (type (;4;) (func (param i32)))
  (type (;5;) (func (param i32 i32 i32 i32 i32 i32 i32 i32) (result i32)))
  (type (;6;) (func (param i32 i32 i32 i32 i32 i32 i32) (result i32)))
  (type (;7;) (func (param i32 i32 i32) (result i32)))
  (type (;8;) (func (param i32 i32)))
  (type (;9;) (func))
  (type (;10;) (func (param i32 i32 i32)))
  (type (;11;) (func (param i32 i32 i32 i32 i32)))
  (type (;12;) (func (param i32 i32 i32 i32 i32 i32) (result i32)))
  (type (;13;) (func (param i32 i32 i32 i32 i32) (result i32)))
  (import "env" "casper_get_named_arg" (func (;0;) (type 3)))
  (import "env" "casper_create_purse" (func (;1;) (type 1)))
  (import "env" "casper_get_main_purse" (func (;2;) (type 4)))
  (import "env" "casper_transfer_from_purse_to_purse" (func (;3;) (type 5)))
  (import "env" "casper_call_contract" (func (;4;) (type 6)))
  (import "env" "casper_read_host_buffer" (func (;5;) (type 7)))
  (import "env" "casper_revert" (func (;6;) (type 4)))
  (import "env" "casper_get_named_arg_size" (func (;7;) (type 7)))
  (func (;8;) (type 8) (param i32 i32)
    local.get 0
    local.get 1
    call 9)
  (func (;9;) (type 8) (param i32 i32)
    local.get 0
    local.get 1
    i32.const 1
    i32.const 1
    call 47)
  (func (;10;) (type 9)
    i32.const 1
    call 11
    unreachable)
  (func (;11;) (type 4) (param i32)
    local.get 0
    call 56
    call 6
    unreachable)
  (func (;12;) (type 3) (param i32 i32 i32 i32) (result i32)
    (local i32)
    block  ;; label = @1
      local.get 2
      local.get 3
      call 13
      local.tee 4
      i32.eqz
      br_if 0 (;@1;)
      block  ;; label = @2
        local.get 3
        local.get 1
        local.get 3
        local.get 1
        i32.lt_u
        select
        local.tee 3
        i32.eqz
        br_if 0 (;@2;)
        local.get 4
        local.get 0
        local.get 3
        call $memcpy
      end
      local.get 0
      local.get 2
      local.get 1
      call 14
    end
    local.get 4)
  (func (;13;) (type 1) (param i32 i32) (result i32)
    (local i32 i32)
    global.get 0
    i32.const 16
    i32.sub
    local.tee 2
    global.set 0
    local.get 1
    i32.const 3
    i32.add
    i32.const 2
    i32.shr_u
    local.set 1
    block  ;; label = @1
      block  ;; label = @2
        block  ;; label = @3
          local.get 0
          i32.const 4
          i32.gt_u
          br_if 0 (;@3;)
          local.get 1
          i32.const -1
          i32.add
          local.tee 3
          i32.const 256
          i32.lt_u
          br_if 1 (;@2;)
        end
        local.get 2
        i32.const 0
        i32.load offset=1050872
        i32.store offset=8
        local.get 1
        local.get 0
        local.get 2
        i32.const 8
        i32.add
        i32.const 1049824
        i32.const 1
        i32.const 2
        call 78
        local.set 0
        i32.const 0
        local.get 2
        i32.load offset=8
        i32.store offset=1050872
        br 1 (;@1;)
      end
      local.get 2
      i32.const 1050872
      i32.store offset=4
      local.get 2
      local.get 3
      i32.const 2
      i32.shl
      local.tee 3
      i32.load offset=1049848
      i32.store offset=12
      local.get 1
      local.get 0
      local.get 2
      i32.const 12
      i32.add
      local.get 2
      i32.const 4
      i32.add
      i32.const 3
      i32.const 4
      call 78
      local.set 0
      local.get 3
      local.get 2
      i32.load offset=12
      i32.store offset=1049848
    end
    local.get 2
    i32.const 16
    i32.add
    global.set 0
    local.get 0)
  (func (;14;) (type 10) (param i32 i32 i32)
    (local i32)
    global.get 0
    i32.const 16
    i32.sub
    local.tee 3
    global.set 0
    block  ;; label = @1
      block  ;; label = @2
        block  ;; label = @3
          local.get 1
          i32.const 4
          i32.gt_u
          br_if 0 (;@3;)
          local.get 2
          i32.const 3
          i32.add
          i32.const 2
          i32.shr_u
          i32.const -1
          i32.add
          local.tee 1
          i32.const 256
          i32.lt_u
          br_if 1 (;@2;)
        end
        local.get 3
        i32.const 0
        i32.load offset=1050872
        i32.store offset=8
        local.get 0
        local.get 3
        i32.const 8
        i32.add
        i32.const 1049824
        i32.const 5
        call 84
        i32.const 0
        local.get 3
        i32.load offset=8
        i32.store offset=1050872
        br 1 (;@1;)
      end
      local.get 3
      i32.const 1050872
      i32.store offset=4
      local.get 3
      local.get 1
      i32.const 2
      i32.shl
      local.tee 1
      i32.load offset=1049848
      i32.store offset=12
      local.get 0
      local.get 3
      i32.const 12
      i32.add
      local.get 3
      i32.const 4
      i32.add
      i32.const 6
      call 84
      local.get 1
      local.get 3
      i32.load offset=12
      i32.store offset=1049848
    end
    local.get 3
    i32.const 16
    i32.add
    global.set 0)
  (func (;15;) (type 8) (param i32 i32)
    (local i32)
    block  ;; label = @1
      local.get 0
      i32.load offset=8
      local.tee 2
      local.get 0
      i32.load
      i32.ne
      br_if 0 (;@1;)
      local.get 0
      call 16
    end
    block  ;; label = @1
      i32.const 40
      i32.eqz
      br_if 0 (;@1;)
      local.get 0
      i32.load offset=4
      local.get 2
      i32.const 40
      i32.mul
      i32.add
      local.get 1
      i32.const 40
      call $memcpy
    end
    local.get 0
    local.get 2
    i32.const 1
    i32.add
    i32.store offset=8)
  (func (;16;) (type 4) (param i32)
    (local i32 i32 i32 i32 i32 i32)
    global.get 0
    i32.const 32
    i32.sub
    local.tee 1
    global.set 0
    block  ;; label = @1
      block  ;; label = @2
        block  ;; label = @3
          local.get 0
          i32.load
          local.tee 2
          i32.const 26843545
          i32.le_u
          br_if 0 (;@3;)
          i32.const 0
          local.set 2
          local.get 1
          i32.const 20
          i32.add
          local.set 0
          br 1 (;@2;)
        end
        local.get 2
        i32.const 1
        i32.shl
        local.tee 3
        i32.const 4
        local.get 3
        i32.const 4
        i32.gt_u
        select
        local.set 3
        block  ;; label = @3
          block  ;; label = @4
            local.get 2
            br_if 0 (;@4;)
            i32.const 0
            local.set 4
            local.get 1
            i32.const 28
            i32.add
            local.set 5
            br 1 (;@3;)
          end
          local.get 0
          i32.load offset=4
          local.set 6
          local.get 1
          i32.const 4
          i32.store offset=28
          local.get 2
          i32.const 40
          i32.mul
          local.set 4
          local.get 1
          i32.const 24
          i32.add
          local.set 5
        end
        local.get 3
        i32.const 40
        i32.mul
        local.set 2
        local.get 5
        local.get 4
        i32.store
        block  ;; label = @3
          block  ;; label = @4
            local.get 1
            i32.load offset=28
            i32.eqz
            br_if 0 (;@4;)
            block  ;; label = @5
              local.get 1
              i32.load offset=24
              local.tee 4
              br_if 0 (;@5;)
              local.get 1
              i32.const 8
              i32.add
              i32.const 4
              local.get 2
              call 68
              local.get 1
              i32.load offset=8
              local.set 4
              br 2 (;@3;)
            end
            local.get 6
            local.get 4
            i32.const 4
            local.get 2
            call 12
            local.set 4
            br 1 (;@3;)
          end
          local.get 1
          i32.const 4
          local.get 2
          call 68
          local.get 1
          i32.load
          local.set 4
        end
        local.get 4
        br_if 1 (;@1;)
        local.get 1
        i32.const 4
        i32.store offset=20
        local.get 1
        i32.const 16
        i32.add
        local.set 0
      end
      local.get 0
      local.get 2
      i32.store
      local.get 1
      i32.load offset=20
      local.get 1
      i32.load offset=16
      call 19
      unreachable
    end
    local.get 0
    local.get 3
    i32.store
    local.get 0
    local.get 4
    i32.store offset=4
    local.get 1
    i32.const 32
    i32.add
    global.set 0)
  (func (;17;) (type 10) (param i32 i32 i32)
    (local i32 i32 i32)
    global.get 0
    i32.const 16
    i32.sub
    local.tee 3
    global.set 0
    local.get 3
    i32.const 4
    i32.add
    local.get 2
    call 18
    local.get 3
    i32.load offset=8
    local.set 4
    block  ;; label = @1
      local.get 3
      i32.load offset=4
      i32.const 1
      i32.eq
      br_if 0 (;@1;)
      local.get 3
      i32.load offset=12
      local.set 5
      block  ;; label = @2
        local.get 2
        i32.eqz
        br_if 0 (;@2;)
        local.get 5
        local.get 1
        local.get 2
        call $memcpy
      end
      local.get 0
      local.get 2
      i32.store offset=8
      local.get 0
      local.get 5
      i32.store offset=4
      local.get 0
      local.get 4
      i32.store
      local.get 3
      i32.const 16
      i32.add
      global.set 0
      return
    end
    local.get 4
    local.get 3
    i32.load offset=12
    call 19
    unreachable)
  (func (;18;) (type 8) (param i32 i32)
    (local i32 i32 i32)
    global.get 0
    i32.const 16
    i32.sub
    local.tee 2
    global.set 0
    block  ;; label = @1
      block  ;; label = @2
        local.get 1
        i32.const -1
        i32.gt_s
        br_if 0 (;@2;)
        local.get 0
        i32.const 0
        i32.store offset=4
        i32.const 1
        local.set 3
        br 1 (;@1;)
      end
      block  ;; label = @2
        block  ;; label = @3
          local.get 1
          br_if 0 (;@3;)
          local.get 0
          i64.const 4294967296
          i64.store offset=4 align=4
          br 1 (;@2;)
        end
        i32.const 1
        local.set 3
        local.get 2
        i32.const 8
        i32.add
        i32.const 1
        local.get 1
        call 68
        block  ;; label = @3
          local.get 2
          i32.load offset=8
          local.tee 4
          br_if 0 (;@3;)
          local.get 0
          local.get 1
          i32.store offset=8
          local.get 0
          i32.const 1
          i32.store offset=4
          br 2 (;@1;)
        end
        local.get 0
        local.get 4
        i32.store offset=8
        local.get 0
        local.get 1
        i32.store offset=4
      end
      i32.const 0
      local.set 3
    end
    local.get 0
    local.get 3
    i32.store
    local.get 2
    i32.const 16
    i32.add
    global.set 0)
  (func (;19;) (type 8) (param i32 i32)
    block  ;; label = @1
      local.get 0
      i32.eqz
      br_if 0 (;@1;)
      call 46
      unreachable
    end
    call 51
    unreachable)
  (func (;20;) (type 9)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
    global.get 0
    i32.const 544
    i32.sub
    local.tee 0
    global.set 0
    local.get 0
    i32.const 56
    i32.add
    i32.const 1049292
    i32.const 13
    call 21
    block  ;; label = @1
      block  ;; label = @2
        block  ;; label = @3
          block  ;; label = @4
            local.get 0
            i32.load offset=56
            i32.const 1
            i32.and
            i32.eqz
            br_if 0 (;@4;)
            block  ;; label = @5
              block  ;; label = @6
                local.get 0
                i32.load offset=60
                local.tee 1
                br_if 0 (;@6;)
                local.get 0
                i64.const 4294967296
                i64.store offset=232 align=4
                i32.const 1
                local.set 1
                i32.const 0
                local.set 2
                br 1 (;@5;)
              end
              block  ;; label = @6
                block  ;; label = @7
                  i32.const 1049292
                  i32.const 13
                  local.get 1
                  call 22
                  local.tee 3
                  local.get 1
                  call 0
                  call 23
                  local.tee 2
                  i32.const 255
                  i32.and
                  i32.const 55
                  i32.eq
                  br_if 0 (;@7;)
                  local.get 0
                  local.get 2
                  i32.store8 offset=300
                  local.get 0
                  i32.const 303
                  i32.add
                  local.get 2
                  i32.const 24
                  i32.shr_u
                  i32.store8
                  local.get 0
                  local.get 2
                  i32.const 8
                  i32.shr_u
                  i32.store16 offset=301 align=1
                  local.get 1
                  local.get 3
                  call 9
                  i32.const -2147483648
                  local.set 1
                  br 1 (;@6;)
                end
                local.get 0
                local.get 1
                i32.store offset=304
                local.get 0
                local.get 3
                i32.store offset=300
              end
              local.get 0
              local.get 1
              i32.store offset=296
              local.get 0
              i32.const 232
              i32.add
              local.get 0
              i32.const 296
              i32.add
              call 24
              local.get 0
              i32.load offset=240
              local.set 2
              local.get 0
              i32.load offset=236
              local.set 1
            end
            local.get 0
            i32.const 424
            i32.add
            local.get 1
            local.get 2
            call 25
            local.get 0
            i32.load8_u offset=424
            local.set 3
            block  ;; label = @5
              block  ;; label = @6
                local.get 0
                i32.load offset=456
                br_if 0 (;@6;)
                i32.const 1
                local.set 2
                local.get 3
                local.set 4
                br 1 (;@5;)
              end
              local.get 0
              i32.const 360
              i32.add
              i32.const 23
              i32.add
              local.tee 5
              local.get 0
              i32.const 448
              i32.add
              i64.load align=1
              i64.store align=1
              local.get 0
              i32.const 360
              i32.add
              i32.const 16
              i32.add
              local.tee 6
              local.get 0
              i32.const 441
              i32.add
              i64.load align=1
              i64.store
              local.get 0
              i32.const 360
              i32.add
              i32.const 8
              i32.add
              local.tee 7
              local.get 0
              i32.const 433
              i32.add
              i64.load align=1
              i64.store
              local.get 0
              local.get 0
              i64.load offset=425 align=1
              i64.store offset=360
              i32.const 2
              local.set 4
              block  ;; label = @6
                local.get 0
                i32.load offset=460
                local.tee 2
                br_if 0 (;@6;)
                local.get 0
                i32.const 424
                i32.add
                i32.const 23
                i32.add
                local.get 5
                i64.load align=1
                i64.store align=1
                local.get 0
                i32.const 424
                i32.add
                i32.const 16
                i32.add
                local.get 6
                i64.load
                i64.store
                local.get 0
                i32.const 424
                i32.add
                i32.const 8
                i32.add
                local.get 7
                i64.load
                i64.store
                local.get 0
                local.get 0
                i64.load offset=360
                i64.store offset=424
                local.get 3
                local.set 4
              end
              local.get 2
              i32.const 0
              i32.ne
              local.set 2
            end
            local.get 0
            i32.load offset=232
            local.get 1
            call 9
            block  ;; label = @5
              block  ;; label = @6
                block  ;; label = @7
                  block  ;; label = @8
                    local.get 2
                    br_if 0 (;@8;)
                    local.get 0
                    i32.const 64
                    i32.add
                    i32.const 23
                    i32.add
                    local.get 0
                    i32.const 424
                    i32.add
                    i32.const 23
                    i32.add
                    i64.load align=1
                    i64.store align=1
                    local.get 0
                    i32.const 64
                    i32.add
                    i32.const 16
                    i32.add
                    local.get 0
                    i32.const 424
                    i32.add
                    i32.const 16
                    i32.add
                    i64.load
                    i64.store
                    local.get 0
                    i32.const 64
                    i32.add
                    i32.const 8
                    i32.add
                    local.get 0
                    i32.const 424
                    i32.add
                    i32.const 8
                    i32.add
                    i64.load
                    i64.store
                    local.get 0
                    local.get 0
                    i64.load offset=424
                    i64.store offset=64
                    local.get 0
                    i32.const 48
                    i32.add
                    i32.const 1049305
                    i32.const 6
                    call 21
                    local.get 0
                    i32.load offset=48
                    i32.const 1
                    i32.and
                    i32.eqz
                    br_if 4 (;@4;)
                    block  ;; label = @9
                      local.get 0
                      i32.load offset=52
                      local.tee 1
                      br_if 0 (;@9;)
                      local.get 0
                      i32.const 0
                      i32.store offset=512
                      local.get 0
                      i64.const 4294967296
                      i64.store offset=504 align=4
                      i32.const 1
                      local.set 2
                      br 3 (;@6;)
                    end
                    block  ;; label = @9
                      block  ;; label = @10
                        i32.const 1049305
                        i32.const 6
                        local.get 1
                        call 22
                        local.tee 3
                        local.get 1
                        call 0
                        call 23
                        local.tee 2
                        i32.const 255
                        i32.and
                        i32.const 55
                        i32.eq
                        br_if 0 (;@10;)
                        local.get 0
                        local.get 2
                        i32.store8 offset=528
                        local.get 0
                        i32.const 531
                        i32.add
                        local.get 2
                        i32.const 24
                        i32.shr_u
                        i32.store8
                        local.get 0
                        local.get 2
                        i32.const 8
                        i32.shr_u
                        i32.store16 offset=529 align=1
                        local.get 1
                        local.get 3
                        call 9
                        i32.const -2147483648
                        local.set 1
                        br 1 (;@9;)
                      end
                      local.get 0
                      local.get 1
                      i32.store offset=532
                      local.get 0
                      local.get 3
                      i32.store offset=528
                    end
                    local.get 0
                    local.get 1
                    i32.store offset=524
                    local.get 0
                    i32.const 504
                    i32.add
                    local.get 0
                    i32.const 524
                    i32.add
                    call 24
                    local.get 0
                    i32.load offset=508
                    local.set 2
                    local.get 0
                    i32.load offset=512
                    local.tee 1
                    i32.eqz
                    br_if 2 (;@6;)
                    local.get 2
                    i32.load8_u
                    local.tee 3
                    i32.const 64
                    i32.gt_u
                    br_if 2 (;@6;)
                    local.get 0
                    i32.const 424
                    i32.add
                    local.get 2
                    i32.const 1
                    i32.add
                    local.get 1
                    i32.const -1
                    i32.add
                    local.get 3
                    call 26
                    local.get 0
                    i32.load offset=424
                    local.tee 6
                    i32.eqz
                    br_if 2 (;@6;)
                    local.get 0
                    i32.load offset=428
                    local.tee 3
                    i32.const 65
                    i32.ge_u
                    br_if 1 (;@7;)
                    local.get 0
                    i32.load offset=436
                    local.set 5
                    i32.const 0
                    local.set 1
                    block  ;; label = @9
                      i32.const 64
                      i32.eqz
                      local.tee 7
                      br_if 0 (;@9;)
                      local.get 0
                      i32.const 360
                      i32.add
                      i32.const 0
                      i32.const 64
                      call $memset
                    end
                    local.get 0
                    i32.const 40
                    i32.add
                    local.get 3
                    local.get 0
                    i32.const 360
                    i32.add
                    i32.const 64
                    i32.const 1049464
                    call 27
                    local.get 0
                    i32.load offset=40
                    local.get 0
                    i32.load offset=44
                    local.get 6
                    local.get 3
                    i32.const 1049464
                    call 28
                    block  ;; label = @9
                      local.get 7
                      br_if 0 (;@9;)
                      local.get 0
                      i32.const 424
                      i32.add
                      i32.const 0
                      i32.const 64
                      call $memset
                    end
                    block  ;; label = @9
                      loop  ;; label = @10
                        local.get 1
                        i32.const 64
                        i32.eq
                        br_if 1 (;@9;)
                        local.get 0
                        i32.const 424
                        i32.add
                        local.get 1
                        i32.add
                        local.get 0
                        i32.const 360
                        i32.add
                        local.get 1
                        i32.add
                        i64.load align=1
                        i64.store
                        local.get 1
                        i32.const 8
                        i32.add
                        local.set 1
                        br 0 (;@10;)
                      end
                    end
                    local.get 0
                    i32.load8_u offset=424
                    local.set 3
                    block  ;; label = @9
                      i32.const 63
                      i32.eqz
                      local.tee 1
                      br_if 0 (;@9;)
                      local.get 0
                      i32.const 296
                      i32.add
                      local.get 0
                      i32.const 424
                      i32.add
                      i32.const 1
                      i32.or
                      i32.const 63
                      call $memcpy
                    end
                    block  ;; label = @9
                      local.get 1
                      br_if 0 (;@9;)
                      local.get 0
                      i32.const 424
                      i32.add
                      local.get 0
                      i32.const 296
                      i32.add
                      i32.const 63
                      call $memcpy
                    end
                    block  ;; label = @9
                      local.get 5
                      br_if 0 (;@9;)
                      i32.const 63
                      i32.eqz
                      br_if 0 (;@9;)
                      local.get 0
                      i32.const 232
                      i32.add
                      local.get 0
                      i32.const 424
                      i32.add
                      i32.const 63
                      call $memcpy
                    end
                    local.get 5
                    i32.const 0
                    i32.ne
                    local.set 1
                    br 3 (;@5;)
                  end
                  i32.const 2
                  call 11
                  unreachable
                end
                call 29
                unreachable
              end
              i32.const 1
              local.set 1
            end
            local.get 0
            i32.load offset=504
            local.get 2
            call 9
            block  ;; label = @5
              local.get 1
              br_if 0 (;@5;)
              local.get 0
              local.get 3
              i32.store8 offset=96
              block  ;; label = @6
                i32.const 63
                i32.eqz
                br_if 0 (;@6;)
                local.get 0
                i32.const 96
                i32.add
                i32.const 1
                i32.or
                local.get 0
                i32.const 232
                i32.add
                i32.const 63
                call $memcpy
              end
              local.get 0
              i32.const 32
              i32.add
              i32.const 1049311
              i32.const 10
              call 21
              local.get 0
              i32.load offset=32
              i32.const 1
              i32.and
              i32.eqz
              br_if 1 (;@4;)
              block  ;; label = @6
                block  ;; label = @7
                  local.get 0
                  i32.load offset=36
                  local.tee 1
                  br_if 0 (;@7;)
                  i32.const 0
                  local.set 1
                  local.get 0
                  i32.const 0
                  i32.store offset=304
                  local.get 0
                  i64.const 4294967296
                  i64.store offset=296 align=4
                  i32.const 1
                  local.set 7
                  br 1 (;@6;)
                end
                block  ;; label = @7
                  block  ;; label = @8
                    i32.const 1049311
                    i32.const 10
                    local.get 1
                    call 22
                    local.tee 3
                    local.get 1
                    call 0
                    call 23
                    local.tee 2
                    i32.const 255
                    i32.and
                    i32.const 55
                    i32.eq
                    br_if 0 (;@8;)
                    local.get 0
                    local.get 2
                    i32.store8 offset=364
                    local.get 0
                    i32.const 367
                    i32.add
                    local.get 2
                    i32.const 24
                    i32.shr_u
                    i32.store8
                    local.get 0
                    local.get 2
                    i32.const 8
                    i32.shr_u
                    i32.store16 offset=365 align=1
                    local.get 1
                    local.get 3
                    call 9
                    i32.const -2147483648
                    local.set 1
                    br 1 (;@7;)
                  end
                  local.get 0
                  local.get 1
                  i32.store offset=368
                  local.get 0
                  local.get 3
                  i32.store offset=364
                end
                local.get 0
                local.get 1
                i32.store offset=360
                local.get 0
                i32.const 296
                i32.add
                local.get 0
                i32.const 360
                i32.add
                call 24
                local.get 0
                i32.load offset=304
                local.set 1
                local.get 0
                i32.load offset=300
                local.set 7
              end
              i32.const 0
              local.set 8
              local.get 0
              i32.const 0
              i32.store offset=232
              local.get 0
              i32.const 424
              i32.add
              local.get 7
              local.get 1
              i32.const 4
              call 26
              block  ;; label = @6
                local.get 0
                i32.load offset=424
                local.tee 1
                br_if 0 (;@6;)
                local.get 0
                i32.load8_u offset=428
                local.set 2
                i32.const -2147483648
                local.set 5
                br 4 (;@2;)
              end
              local.get 0
              i32.load offset=436
              local.set 2
              local.get 0
              i32.load offset=432
              local.set 3
              local.get 0
              i32.const 232
              i32.add
              i32.const 4
              local.get 1
              local.get 0
              i32.load offset=428
              i32.const 1049552
              call 28
              local.get 0
              i32.const 424
              i32.add
              local.get 3
              local.get 2
              local.get 0
              i32.load offset=232
              call 26
              block  ;; label = @6
                local.get 0
                i32.load offset=424
                local.tee 1
                br_if 0 (;@6;)
                local.get 0
                i32.load8_u offset=428
                local.set 2
                i32.const -2147483648
                local.set 5
                br 3 (;@3;)
              end
              local.get 0
              i32.load offset=436
              local.set 9
              local.get 0
              i32.const 24
              i32.add
              local.get 0
              i32.load offset=428
              local.tee 3
              call 30
              local.get 0
              i32.load offset=24
              local.set 10
              local.get 0
              i32.load offset=28
              local.set 2
              block  ;; label = @6
                local.get 3
                i32.eqz
                br_if 0 (;@6;)
                local.get 2
                local.get 1
                local.get 3
                call $memcpy
              end
              block  ;; label = @6
                local.get 3
                i32.eqz
                br_if 0 (;@6;)
                i32.const 0
                local.get 3
                i32.const -7
                i32.add
                local.tee 1
                local.get 1
                local.get 3
                i32.gt_u
                select
                local.set 6
                local.get 2
                i32.const 3
                i32.add
                i32.const -4
                i32.and
                local.get 2
                i32.sub
                local.set 11
                i32.const 0
                local.set 1
                loop  ;; label = @7
                  block  ;; label = @8
                    block  ;; label = @9
                      block  ;; label = @10
                        block  ;; label = @11
                          local.get 2
                          local.get 1
                          i32.add
                          i32.load8_u
                          local.tee 5
                          i32.const 24
                          i32.shl
                          i32.const 24
                          i32.shr_s
                          local.tee 8
                          i32.const 0
                          i32.lt_s
                          br_if 0 (;@11;)
                          local.get 11
                          local.get 1
                          i32.sub
                          i32.const 3
                          i32.and
                          br_if 1 (;@10;)
                          local.get 1
                          local.get 6
                          i32.ge_u
                          br_if 2 (;@9;)
                          loop  ;; label = @12
                            local.get 2
                            local.get 1
                            i32.add
                            local.tee 5
                            i32.const 4
                            i32.add
                            i32.load
                            local.get 5
                            i32.load
                            i32.or
                            i32.const -2139062144
                            i32.and
                            br_if 3 (;@9;)
                            local.get 1
                            i32.const 8
                            i32.add
                            local.tee 1
                            local.get 6
                            i32.lt_u
                            br_if 0 (;@12;)
                            br 3 (;@9;)
                          end
                        end
                        block  ;; label = @11
                          block  ;; label = @12
                            block  ;; label = @13
                              block  ;; label = @14
                                block  ;; label = @15
                                  block  ;; label = @16
                                    block  ;; label = @17
                                      local.get 5
                                      i32.load8_u offset=1049568
                                      i32.const -2
                                      i32.add
                                      br_table 0 (;@17;) 1 (;@16;) 2 (;@15;) 5 (;@12;)
                                    end
                                    local.get 1
                                    i32.const 1
                                    i32.add
                                    local.tee 5
                                    local.get 3
                                    i32.ge_u
                                    br_if 4 (;@12;)
                                    local.get 2
                                    local.get 5
                                    i32.add
                                    i32.load8_s
                                    i32.const -65
                                    i32.gt_s
                                    br_if 4 (;@12;)
                                    br 5 (;@11;)
                                  end
                                  local.get 1
                                  i32.const 1
                                  i32.add
                                  local.tee 12
                                  local.get 3
                                  i32.ge_u
                                  br_if 3 (;@12;)
                                  local.get 2
                                  local.get 12
                                  i32.add
                                  i32.load8_s
                                  local.set 12
                                  block  ;; label = @16
                                    block  ;; label = @17
                                      local.get 5
                                      i32.const 224
                                      i32.eq
                                      br_if 0 (;@17;)
                                      local.get 5
                                      i32.const 237
                                      i32.eq
                                      br_if 1 (;@16;)
                                      local.get 8
                                      i32.const 31
                                      i32.add
                                      i32.const 255
                                      i32.and
                                      i32.const 12
                                      i32.lt_u
                                      br_if 3 (;@14;)
                                      local.get 8
                                      i32.const -2
                                      i32.and
                                      i32.const -18
                                      i32.ne
                                      br_if 5 (;@12;)
                                      local.get 12
                                      i32.const -64
                                      i32.lt_s
                                      br_if 4 (;@13;)
                                      br 5 (;@12;)
                                    end
                                    local.get 12
                                    i32.const -32
                                    i32.and
                                    i32.const -96
                                    i32.eq
                                    br_if 3 (;@13;)
                                    br 4 (;@12;)
                                  end
                                  local.get 12
                                  i32.const -97
                                  i32.gt_s
                                  br_if 3 (;@12;)
                                  br 2 (;@13;)
                                end
                                local.get 1
                                i32.const 1
                                i32.add
                                local.tee 12
                                local.get 3
                                i32.ge_u
                                br_if 2 (;@12;)
                                local.get 2
                                local.get 12
                                i32.add
                                i32.load8_s
                                local.set 12
                                block  ;; label = @15
                                  block  ;; label = @16
                                    block  ;; label = @17
                                      block  ;; label = @18
                                        local.get 5
                                        i32.const -240
                                        i32.add
                                        br_table 1 (;@17;) 0 (;@18;) 0 (;@18;) 0 (;@18;) 2 (;@16;) 0 (;@18;)
                                      end
                                      local.get 8
                                      i32.const 15
                                      i32.add
                                      i32.const 255
                                      i32.and
                                      i32.const 2
                                      i32.gt_u
                                      br_if 5 (;@12;)
                                      local.get 12
                                      i32.const -64
                                      i32.lt_s
                                      br_if 2 (;@15;)
                                      br 5 (;@12;)
                                    end
                                    local.get 12
                                    i32.const 112
                                    i32.add
                                    i32.const 255
                                    i32.and
                                    i32.const 48
                                    i32.lt_u
                                    br_if 1 (;@15;)
                                    br 4 (;@12;)
                                  end
                                  local.get 12
                                  i32.const -113
                                  i32.gt_s
                                  br_if 3 (;@12;)
                                end
                                local.get 1
                                i32.const 2
                                i32.add
                                local.tee 5
                                local.get 3
                                i32.ge_u
                                br_if 2 (;@12;)
                                local.get 2
                                local.get 5
                                i32.add
                                i32.load8_s
                                i32.const -65
                                i32.gt_s
                                br_if 2 (;@12;)
                                local.get 1
                                i32.const 3
                                i32.add
                                local.tee 5
                                local.get 3
                                i32.ge_u
                                br_if 2 (;@12;)
                                local.get 2
                                local.get 5
                                i32.add
                                i32.load8_s
                                i32.const -64
                                i32.lt_s
                                br_if 3 (;@11;)
                                br 2 (;@12;)
                              end
                              local.get 12
                              i32.const -64
                              i32.ge_s
                              br_if 1 (;@12;)
                            end
                            local.get 1
                            i32.const 2
                            i32.add
                            local.tee 5
                            local.get 3
                            i32.ge_u
                            br_if 0 (;@12;)
                            local.get 2
                            local.get 5
                            i32.add
                            i32.load8_s
                            i32.const -65
                            i32.le_s
                            br_if 1 (;@11;)
                          end
                          i32.const -2147483648
                          local.set 5
                          block  ;; label = @12
                            local.get 10
                            i32.const -2147483648
                            i32.ne
                            br_if 0 (;@12;)
                            local.get 2
                            local.set 10
                            local.get 3
                            local.set 2
                            local.get 1
                            local.set 3
                            br 6 (;@6;)
                          end
                          local.get 10
                          local.get 2
                          call 9
                          i32.const 1
                          local.set 2
                          br 8 (;@3;)
                        end
                        local.get 5
                        i32.const 1
                        i32.add
                        local.set 1
                        br 2 (;@8;)
                      end
                      local.get 1
                      i32.const 1
                      i32.add
                      local.set 1
                      br 1 (;@8;)
                    end
                    local.get 1
                    local.get 3
                    i32.ge_u
                    br_if 0 (;@8;)
                    loop  ;; label = @9
                      local.get 2
                      local.get 1
                      i32.add
                      i32.load8_s
                      i32.const 0
                      i32.lt_s
                      br_if 1 (;@8;)
                      local.get 3
                      local.get 1
                      i32.const 1
                      i32.add
                      local.tee 1
                      i32.ne
                      br_if 0 (;@9;)
                      br 3 (;@6;)
                    end
                  end
                  local.get 1
                  local.get 3
                  i32.lt_u
                  br_if 0 (;@7;)
                end
              end
              i32.const -2147483648
              local.set 5
              i32.const 0
              local.set 8
              local.get 10
              i32.const -2147483648
              i32.eq
              br_if 3 (;@2;)
              block  ;; label = @6
                local.get 9
                br_if 0 (;@6;)
                local.get 2
                i32.const -256
                i32.and
                local.set 8
                local.get 10
                local.set 5
                br 5 (;@1;)
              end
              local.get 10
              local.get 2
              call 9
              i32.const 2
              local.set 2
              br 3 (;@2;)
            end
            i32.const 2
            call 11
            unreachable
          end
          call 10
          unreachable
        end
        i32.const 0
        local.set 8
      end
    end
    local.get 0
    i32.load offset=296
    local.get 7
    call 9
    block  ;; label = @1
      block  ;; label = @2
        block  ;; label = @3
          local.get 5
          i32.const -2147483648
          i32.eq
          br_if 0 (;@3;)
          i32.const 33
          call 22
          local.tee 1
          i32.const 33
          call 1
          call 23
          call 31
          local.get 0
          i32.const 33
          i32.store offset=368
          local.get 0
          local.get 1
          i32.store offset=364
          local.get 0
          i32.const 33
          i32.store offset=360
          local.get 0
          i32.const 424
          i32.add
          local.get 0
          i32.const 360
          i32.add
          call 32
          local.get 0
          i32.const 166
          i32.add
          local.get 0
          i32.const 424
          i32.add
          call 33
          i32.const 33
          call 22
          local.tee 1
          call 2
          local.get 0
          i32.const 33
          i32.store offset=368
          local.get 0
          local.get 1
          i32.store offset=364
          local.get 0
          i32.const 33
          i32.store offset=360
          local.get 0
          i32.const 424
          i32.add
          local.get 0
          i32.const 360
          i32.add
          call 32
          local.get 0
          i32.const 199
          i32.add
          local.get 0
          i32.const 424
          i32.add
          call 33
          local.get 0
          i32.const 424
          i32.add
          local.get 0
          i32.const 199
          i32.add
          call 34
          local.get 0
          i32.load offset=436
          local.set 7
          local.get 0
          i32.load offset=432
          local.set 11
          local.get 0
          i32.load offset=428
          local.set 10
          local.get 0
          i32.load offset=424
          local.set 9
          local.get 0
          i32.const 424
          i32.add
          local.get 0
          i32.const 166
          i32.add
          call 34
          local.get 0
          i32.load offset=436
          local.set 12
          local.get 0
          i32.load offset=432
          local.set 13
          local.get 0
          i32.load offset=428
          local.set 14
          local.get 0
          i32.load offset=424
          local.set 15
          local.get 0
          i32.const 424
          i32.add
          local.get 0
          i32.const 96
          i32.add
          call 35
          local.get 0
          i32.const 360
          i32.add
          local.get 0
          i32.const 424
          i32.add
          call 36
          local.get 0
          i32.load offset=364
          local.set 1
          local.get 0
          i32.load offset=368
          local.set 16
          local.get 0
          i32.load offset=360
          local.set 17
          block  ;; label = @4
            i32.const 1
            i32.const 1
            call 13
            local.tee 6
            i32.eqz
            br_if 0 (;@4;)
            local.get 6
            i32.const 0
            i32.store8
            local.get 0
            i32.const 1
            i32.store offset=432
            local.get 0
            local.get 6
            i32.store offset=428
            local.get 0
            i32.const 1
            i32.store offset=424
            local.get 0
            i32.const 360
            i32.add
            local.get 0
            i32.const 424
            i32.add
            call 36
            local.get 0
            i32.load offset=360
            local.set 6
            local.get 9
            local.get 10
            local.get 15
            local.get 14
            local.get 1
            local.get 16
            local.get 0
            i32.load offset=364
            local.tee 18
            local.get 0
            i32.load offset=368
            call 3
            call 23
            local.set 10
            local.get 6
            local.get 18
            call 9
            local.get 17
            local.get 1
            call 9
            local.get 13
            local.get 12
            call 9
            local.get 11
            local.get 7
            call 9
            local.get 10
            call 31
            local.get 0
            i32.const 0
            i32.store offset=368
            local.get 0
            i64.const 17179869184
            i64.store offset=360 align=4
            local.get 0
            i32.const 424
            i32.add
            local.get 0
            i32.const 96
            i32.add
            call 35
            block  ;; label = @5
              local.get 0
              i32.load offset=424
              local.tee 1
              i32.const -2147483648
              i32.eq
              br_if 0 (;@5;)
              local.get 0
              local.get 0
              i32.load offset=429 align=1
              i32.store offset=296
              local.get 0
              local.get 0
              i32.const 424
              i32.add
              i32.const 8
              i32.add
              local.tee 7
              i32.load align=1
              i32.store offset=299 align=1
              local.get 0
              i32.load8_u offset=428
              local.set 6
              local.get 0
              i32.const 452
              i32.add
              local.tee 11
              i32.const 1049305
              i32.const 6
              call 17
              local.get 0
              i32.const 448
              i32.add
              local.tee 10
              local.get 0
              i32.load offset=299 align=1
              i32.store align=1
              local.get 0
              local.get 6
              i32.store8 offset=444
              local.get 0
              local.get 1
              i32.store offset=440
              local.get 0
              i32.const 8
              i32.store offset=424
              local.get 0
              local.get 0
              i32.load offset=296
              i32.store offset=445 align=1
              local.get 0
              i32.const 360
              i32.add
              local.get 0
              i32.const 424
              i32.add
              call 15
              local.get 0
              i32.const 424
              i32.add
              local.get 0
              i32.const 166
              i32.add
              call 37
              block  ;; label = @6
                local.get 0
                i32.load offset=424
                local.tee 1
                i32.const -2147483648
                i32.eq
                br_if 0 (;@6;)
                local.get 0
                local.get 0
                i32.load offset=429 align=1
                i32.store offset=296
                local.get 0
                local.get 7
                i32.load align=1
                i32.store offset=299 align=1
                local.get 0
                i32.load8_u offset=428
                local.set 6
                local.get 11
                i32.const 1049340
                i32.const 5
                call 17
                local.get 10
                local.get 0
                i32.load offset=299 align=1
                i32.store align=1
                local.get 0
                local.get 6
                i32.store8 offset=444
                local.get 0
                local.get 1
                i32.store offset=440
                local.get 0
                i32.const 12
                i32.store offset=424
                local.get 0
                local.get 0
                i32.load offset=296
                i32.store offset=445 align=1
                local.get 0
                i32.const 360
                i32.add
                local.get 0
                i32.const 424
                i32.add
                call 15
                local.get 0
                i32.const 424
                i32.add
                local.get 8
                local.get 2
                i32.const 255
                i32.and
                i32.or
                local.tee 1
                local.get 3
                call 38
                local.get 5
                local.get 1
                call 9
                block  ;; label = @7
                  local.get 0
                  i32.load offset=424
                  local.tee 1
                  i32.const -2147483648
                  i32.eq
                  br_if 0 (;@7;)
                  local.get 0
                  local.get 0
                  i32.load offset=429 align=1
                  i32.store offset=296
                  local.get 0
                  local.get 0
                  i32.const 424
                  i32.add
                  i32.const 8
                  i32.add
                  i32.load align=1
                  i32.store offset=299 align=1
                  local.get 0
                  i32.load8_u offset=428
                  local.set 2
                  local.get 0
                  i32.const 452
                  i32.add
                  i32.const 1049311
                  i32.const 10
                  call 17
                  local.get 0
                  i32.const 424
                  i32.add
                  i32.const 24
                  i32.add
                  local.get 0
                  i32.load offset=299 align=1
                  i32.store align=1
                  local.get 0
                  local.get 2
                  i32.store8 offset=444
                  local.get 0
                  local.get 1
                  i32.store offset=440
                  local.get 0
                  i32.const 10
                  i32.store offset=424
                  local.get 0
                  local.get 0
                  i32.load offset=296
                  i32.store offset=445 align=1
                  local.get 0
                  i32.const 360
                  i32.add
                  local.get 0
                  i32.const 424
                  i32.add
                  call 15
                  local.get 0
                  i32.load offset=360
                  local.set 13
                  local.get 0
                  i32.load offset=364
                  local.set 6
                  local.get 0
                  i32.load offset=368
                  local.set 2
                  local.get 0
                  i32.const 424
                  i32.add
                  i32.const 32
                  call 18
                  local.get 0
                  i32.load offset=428
                  local.set 3
                  block  ;; label = @8
                    local.get 0
                    i32.load offset=424
                    i32.const 1
                    i32.eq
                    br_if 0 (;@8;)
                    local.get 0
                    i32.load offset=432
                    local.tee 1
                    local.get 4
                    i32.store8
                    local.get 1
                    local.get 0
                    i64.load offset=64
                    i64.store offset=1 align=1
                    local.get 1
                    i32.const 9
                    i32.add
                    local.get 0
                    i32.const 64
                    i32.add
                    i32.const 8
                    i32.add
                    i64.load
                    i64.store align=1
                    local.get 1
                    i32.const 17
                    i32.add
                    local.get 0
                    i32.const 80
                    i32.add
                    i64.load
                    i64.store align=1
                    local.get 1
                    i32.const 24
                    i32.add
                    local.get 0
                    i32.const 87
                    i32.add
                    i64.load align=1
                    i64.store align=1
                    local.get 0
                    local.get 1
                    i32.store offset=428
                    local.get 0
                    local.get 3
                    i32.store offset=424
                    local.get 0
                    i32.const 32
                    i32.store offset=432
                    local.get 0
                    i32.const 360
                    i32.add
                    local.get 0
                    i32.const 424
                    i32.add
                    call 36
                    local.get 0
                    i32.load offset=364
                    local.set 8
                    local.get 0
                    i32.load offset=368
                    local.set 14
                    local.get 0
                    i32.load offset=360
                    local.set 16
                    local.get 0
                    i32.const 424
                    i32.add
                    i32.const 1049345
                    i32.const 7
                    call 38
                    local.get 0
                    i32.const 360
                    i32.add
                    local.get 0
                    i32.const 424
                    i32.add
                    call 36
                    local.get 0
                    i32.load offset=364
                    local.set 4
                    local.get 0
                    i32.load offset=368
                    local.set 15
                    local.get 0
                    i32.load offset=360
                    local.set 17
                    block  ;; label = @9
                      block  ;; label = @10
                        local.get 2
                        br_if 0 (;@10;)
                        i32.const 4
                        local.set 1
                        br 1 (;@9;)
                      end
                      i32.const 0
                      local.set 3
                      local.get 6
                      local.set 1
                      local.get 2
                      local.set 5
                      loop  ;; label = @10
                        local.get 1
                        call 39
                        local.get 3
                        i32.add
                        local.set 3
                        local.get 1
                        i32.const 40
                        i32.add
                        local.set 1
                        local.get 5
                        i32.const -1
                        i32.add
                        local.tee 5
                        br_if 0 (;@10;)
                      end
                      local.get 3
                      i32.const 4
                      i32.add
                      local.set 1
                    end
                    local.get 0
                    i32.const 16
                    i32.add
                    local.get 1
                    call 30
                    local.get 0
                    i32.const 0
                    i32.store offset=500
                    local.get 0
                    local.get 0
                    i32.load offset=20
                    local.tee 3
                    i32.store offset=496
                    local.get 0
                    local.get 0
                    i32.load offset=16
                    local.tee 5
                    i32.store offset=492
                    local.get 0
                    i32.const 424
                    i32.add
                    local.get 2
                    call 40
                    local.get 0
                    i32.load8_u offset=428
                    local.set 1
                    block  ;; label = @9
                      local.get 0
                      i32.load offset=424
                      local.tee 7
                      i32.const -2147483648
                      i32.ne
                      br_if 0 (;@9;)
                      local.get 0
                      local.get 1
                      i32.store8 offset=300
                      local.get 0
                      i32.const -2147483648
                      i32.store offset=296
                      br 7 (;@2;)
                    end
                    local.get 0
                    i32.const 360
                    i32.add
                    i32.const 8
                    i32.add
                    local.get 0
                    i32.const 424
                    i32.add
                    i32.const 8
                    i32.add
                    i32.load align=1
                    i32.store align=1
                    local.get 0
                    local.get 0
                    i32.load offset=429 align=1
                    i32.store offset=365 align=1
                    local.get 0
                    local.get 1
                    i32.store8 offset=364
                    local.get 0
                    local.get 7
                    i32.store offset=360
                    local.get 0
                    i32.const 492
                    i32.add
                    local.get 0
                    i32.const 360
                    i32.add
                    call 41
                    local.get 0
                    i32.load offset=360
                    local.get 0
                    i32.load offset=364
                    call 9
                    local.get 2
                    i32.const 40
                    i32.mul
                    local.set 11
                    local.get 0
                    i32.const 232
                    i32.add
                    i32.const 5
                    i32.add
                    local.set 19
                    local.get 0
                    i32.const 296
                    i32.add
                    i32.const 5
                    i32.add
                    local.set 20
                    local.get 0
                    i32.const 360
                    i32.add
                    i32.const 5
                    i32.add
                    local.set 7
                    local.get 0
                    i32.const 424
                    i32.add
                    i32.const 5
                    i32.add
                    local.set 10
                    local.get 0
                    i32.const 524
                    i32.add
                    i32.const 5
                    i32.add
                    local.set 21
                    local.get 0
                    i32.const 504
                    i32.add
                    i32.const 5
                    i32.add
                    local.set 22
                    local.get 0
                    i32.const 531
                    i32.add
                    local.set 18
                    local.get 6
                    local.set 3
                    loop  ;; label = @9
                      block  ;; label = @10
                        block  ;; label = @11
                          block  ;; label = @12
                            block  ;; label = @13
                              block  ;; label = @14
                                block  ;; label = @15
                                  block  ;; label = @16
                                    local.get 11
                                    i32.eqz
                                    br_if 0 (;@16;)
                                    local.get 0
                                    i32.const 8
                                    i32.add
                                    local.get 3
                                    call 39
                                    call 30
                                    local.get 0
                                    i32.load offset=12
                                    local.set 1
                                    local.get 0
                                    i32.load offset=8
                                    local.tee 9
                                    i32.const -2147483648
                                    i32.eq
                                    br_if 5 (;@11;)
                                    local.get 0
                                    local.get 1
                                    i32.store8 offset=528
                                    local.get 18
                                    local.get 1
                                    i32.const 24
                                    i32.shr_u
                                    i32.store8
                                    local.get 0
                                    i32.const 0
                                    i32.store offset=532
                                    local.get 0
                                    local.get 9
                                    i32.store offset=524
                                    local.get 0
                                    local.get 1
                                    i32.const 8
                                    i32.shr_u
                                    i32.store16 offset=529 align=1
                                    local.get 0
                                    i32.const 424
                                    i32.add
                                    local.get 3
                                    i32.load offset=32
                                    local.get 3
                                    i32.load offset=36
                                    call 38
                                    local.get 0
                                    i32.load8_u offset=428
                                    local.set 1
                                    local.get 0
                                    i32.load offset=424
                                    local.tee 12
                                    i32.const -2147483648
                                    i32.eq
                                    br_if 3 (;@13;)
                                    local.get 7
                                    local.get 10
                                    i32.load align=1
                                    i32.store align=1
                                    local.get 7
                                    i32.const 3
                                    i32.add
                                    local.tee 23
                                    local.get 10
                                    i32.const 3
                                    i32.add
                                    i32.load align=1
                                    i32.store align=1
                                    local.get 0
                                    local.get 1
                                    i32.store8 offset=364
                                    local.get 0
                                    local.get 12
                                    i32.store offset=360
                                    local.get 0
                                    i32.const 524
                                    i32.add
                                    local.get 0
                                    i32.const 360
                                    i32.add
                                    call 41
                                    local.get 0
                                    i32.load offset=360
                                    local.get 0
                                    i32.load offset=364
                                    call 9
                                    local.get 0
                                    i32.const 424
                                    i32.add
                                    local.get 3
                                    call 42
                                    i32.const 0
                                    local.set 9
                                    block  ;; label = @17
                                      block  ;; label = @18
                                        block  ;; label = @19
                                          local.get 3
                                          i32.load offset=24
                                          local.tee 1
                                          i32.const 0
                                          i32.lt_s
                                          br_if 0 (;@19;)
                                          local.get 3
                                          i32.load offset=20
                                          local.set 12
                                          block  ;; label = @20
                                            local.get 1
                                            br_if 0 (;@20;)
                                            i32.const 1
                                            local.set 5
                                            i32.const 0
                                            local.set 9
                                            br 3 (;@17;)
                                          end
                                          i32.const 1
                                          local.set 9
                                          i32.const 1
                                          local.get 1
                                          call 13
                                          local.tee 5
                                          br_if 1 (;@18;)
                                          local.get 1
                                          local.set 5
                                        end
                                        local.get 9
                                        local.get 5
                                        call 19
                                        unreachable
                                      end
                                      local.get 1
                                      local.set 9
                                    end
                                    local.get 0
                                    local.get 5
                                    i32.store offset=444
                                    local.get 0
                                    local.get 9
                                    i32.store offset=440
                                    block  ;; label = @17
                                      local.get 1
                                      i32.eqz
                                      br_if 0 (;@17;)
                                      local.get 5
                                      local.get 12
                                      local.get 1
                                      call $memcpy
                                    end
                                    local.get 0
                                    local.get 1
                                    i32.store offset=448
                                    local.get 0
                                    i32.const 360
                                    i32.add
                                    local.get 5
                                    local.get 1
                                    call 38
                                    local.get 9
                                    local.get 5
                                    call 9
                                    local.get 0
                                    i32.load8_u offset=364
                                    local.set 1
                                    local.get 0
                                    i32.load offset=360
                                    local.tee 9
                                    i32.const -2147483648
                                    i32.eq
                                    br_if 1 (;@15;)
                                    local.get 20
                                    local.get 7
                                    i32.load align=1
                                    i32.store align=1
                                    local.get 20
                                    i32.const 3
                                    i32.add
                                    local.tee 12
                                    local.get 23
                                    i32.load align=1
                                    i32.store align=1
                                    local.get 0
                                    local.get 1
                                    i32.store8 offset=300
                                    local.get 0
                                    local.get 9
                                    i32.store offset=296
                                    local.get 0
                                    i32.const 424
                                    i32.add
                                    local.get 0
                                    i32.const 296
                                    i32.add
                                    call 43
                                    local.set 1
                                    local.get 0
                                    i32.load offset=296
                                    local.set 9
                                    block  ;; label = @17
                                      local.get 1
                                      i32.const 255
                                      i32.and
                                      local.tee 1
                                      i32.const 6
                                      i32.eq
                                      br_if 0 (;@17;)
                                      local.get 9
                                      local.get 0
                                      i32.load offset=300
                                      call 9
                                      br 2 (;@15;)
                                    end
                                    local.get 0
                                    local.get 20
                                    i32.load align=1
                                    i32.store offset=536
                                    local.get 0
                                    local.get 12
                                    i32.load align=1
                                    i32.store offset=539 align=1
                                    local.get 0
                                    i32.load8_u offset=300
                                    local.set 1
                                    br 2 (;@14;)
                                  end
                                  local.get 0
                                  i32.const 296
                                  i32.add
                                  i32.const 8
                                  i32.add
                                  local.get 0
                                  i32.const 492
                                  i32.add
                                  i32.const 8
                                  i32.add
                                  i32.load
                                  i32.store
                                  local.get 0
                                  local.get 0
                                  i64.load offset=492 align=4
                                  i64.store offset=296
                                  br 14 (;@1;)
                                end
                                i32.const -2147483648
                                local.set 9
                              end
                              local.get 0
                              i32.const 424
                              i32.add
                              call 44
                              local.get 9
                              i32.const -2147483648
                              i32.ne
                              br_if 1 (;@12;)
                              local.get 0
                              i32.load offset=524
                              local.set 9
                            end
                            local.get 9
                            local.get 0
                            i32.load offset=528
                            call 9
                            br 1 (;@11;)
                          end
                          local.get 19
                          local.get 0
                          i32.load offset=536
                          i32.store align=1
                          local.get 19
                          i32.const 3
                          i32.add
                          local.get 0
                          i32.load offset=539 align=1
                          i32.store align=1
                          local.get 0
                          local.get 1
                          i32.store8 offset=236
                          local.get 0
                          local.get 9
                          i32.store offset=232
                          local.get 0
                          i32.const 524
                          i32.add
                          local.get 0
                          i32.const 232
                          i32.add
                          call 41
                          local.get 0
                          i32.load offset=232
                          local.get 0
                          i32.load offset=236
                          call 9
                          local.get 0
                          local.get 21
                          i32.load align=1
                          i32.store offset=516
                          local.get 0
                          local.get 21
                          i32.const 3
                          i32.add
                          i32.load align=1
                          i32.store offset=519 align=1
                          local.get 0
                          i32.load8_u offset=528
                          local.set 1
                          local.get 0
                          i32.load offset=524
                          local.tee 9
                          i32.const -2147483648
                          i32.ne
                          br_if 1 (;@10;)
                        end
                        local.get 0
                        local.get 1
                        i32.store8 offset=300
                        local.get 0
                        i32.const -2147483648
                        i32.store offset=296
                        local.get 0
                        i32.load offset=496
                        local.set 3
                        local.get 0
                        i32.load offset=492
                        local.set 5
                        br 8 (;@2;)
                      end
                      local.get 22
                      local.get 0
                      i32.load offset=516
                      i32.store align=1
                      local.get 22
                      i32.const 3
                      i32.add
                      local.get 0
                      i32.load offset=519 align=1
                      i32.store align=1
                      local.get 0
                      local.get 1
                      i32.store8 offset=508
                      local.get 0
                      local.get 9
                      i32.store offset=504
                      local.get 0
                      i32.const 492
                      i32.add
                      local.get 0
                      i32.const 504
                      i32.add
                      call 41
                      local.get 0
                      i32.load offset=504
                      local.get 0
                      i32.load offset=508
                      call 9
                      local.get 11
                      i32.const -40
                      i32.add
                      local.set 11
                      local.get 3
                      i32.const 40
                      i32.add
                      local.set 3
                      br 0 (;@9;)
                    end
                  end
                  local.get 3
                  local.get 0
                  i32.load offset=432
                  call 19
                  unreachable
                end
                local.get 0
                i32.const 424
                i32.add
                call 45
                unreachable
              end
              local.get 0
              i32.const 424
              i32.add
              call 45
              unreachable
            end
            local.get 0
            i32.const 424
            i32.add
            call 45
            unreachable
          end
          call 46
          unreachable
        end
        i32.const 2
        call 11
        unreachable
      end
      local.get 5
      local.get 3
      call 9
    end
    local.get 6
    local.set 1
    block  ;; label = @1
      loop  ;; label = @2
        local.get 2
        i32.eqz
        br_if 1 (;@1;)
        local.get 1
        i32.const 28
        i32.add
        i32.load
        local.get 1
        i32.const 32
        i32.add
        i32.load
        call 9
        local.get 1
        call 44
        local.get 1
        i32.const 16
        i32.add
        i32.load
        local.get 1
        i32.const 20
        i32.add
        i32.load
        call 9
        local.get 2
        i32.const -1
        i32.add
        local.set 2
        local.get 1
        i32.const 40
        i32.add
        local.set 1
        br 0 (;@2;)
      end
    end
    local.get 13
    local.get 6
    i32.const 4
    i32.const 40
    call 47
    local.get 0
    i32.const 424
    i32.add
    local.get 0
    i32.const 296
    i32.add
    call 36
    local.get 0
    i32.load offset=424
    local.set 1
    local.get 8
    local.get 14
    local.get 4
    local.get 15
    local.get 0
    i32.load offset=428
    local.tee 2
    local.get 0
    i32.load offset=432
    local.get 0
    i32.const 424
    i32.add
    call 4
    call 23
    call 31
    block  ;; label = @1
      block  ;; label = @2
        local.get 0
        i32.load offset=424
        local.tee 3
        i32.eqz
        br_if 0 (;@2;)
        local.get 3
        call 22
        local.tee 1
        local.get 3
        local.get 0
        i32.const 424
        i32.add
        call 5
        call 23
        local.tee 0
        i32.const 255
        i32.and
        i32.const 55
        i32.ne
        br_if 1 (;@1;)
        local.get 3
        local.get 1
        call 8
        i32.const 18
        call 11
        unreachable
      end
      i32.const 0
      i32.const 1
      call 9
      local.get 1
      local.get 2
      call 9
      local.get 17
      local.get 4
      call 9
      local.get 16
      local.get 8
      call 9
      local.get 0
      i32.const 544
      i32.add
      global.set 0
      return
    end
    local.get 0
    call 48
    unreachable)
  (func (;21;) (type 10) (param i32 i32 i32)
    (local i32 i32 i32)
    global.get 0
    i32.const 16
    i32.sub
    local.tee 3
    global.set 0
    i32.const 0
    local.set 4
    local.get 3
    i32.const 0
    i32.store offset=12
    block  ;; label = @1
      block  ;; label = @2
        local.get 1
        local.get 2
        local.get 3
        i32.const 12
        i32.add
        call 7
        call 23
        local.tee 1
        i32.const 255
        i32.and
        local.tee 2
        i32.const 1
        i32.eq
        br_if 0 (;@2;)
        local.get 2
        i32.const 55
        i32.ne
        br_if 1 (;@1;)
        i32.const 1
        local.set 4
        local.get 3
        i32.load offset=12
        local.set 5
      end
      local.get 0
      local.get 5
      i32.store offset=4
      local.get 0
      local.get 4
      i32.store
      local.get 3
      i32.const 16
      i32.add
      global.set 0
      return
    end
    local.get 1
    call 11
    unreachable)
  (func (;22;) (type 2) (param i32) (result i32)
    (local i32)
    local.get 0
    i32.const 34
    local.get 0
    i32.const -1
    i32.gt_s
    local.tee 1
    select
    local.set 0
    block  ;; label = @1
      block  ;; label = @2
        local.get 1
        i32.eqz
        br_if 0 (;@2;)
        i32.const 1
        local.get 0
        call 13
        local.tee 0
        i32.eqz
        br_if 1 (;@1;)
        local.get 0
        return
      end
      local.get 0
      call 11
      unreachable
    end
    i32.const 19
    call 48
    unreachable)
  (func (;23;) (type 2) (param i32) (result i32)
    (local i32 i32 i32 i32)
    i32.const 0
    local.set 1
    i32.const 55
    local.set 2
    i32.const 0
    local.set 3
    i32.const 0
    local.set 4
    block  ;; label = @1
      block  ;; label = @2
        block  ;; label = @3
          block  ;; label = @4
            block  ;; label = @5
              block  ;; label = @6
                block  ;; label = @7
                  block  ;; label = @8
                    block  ;; label = @9
                      block  ;; label = @10
                        block  ;; label = @11
                          block  ;; label = @12
                            block  ;; label = @13
                              block  ;; label = @14
                                block  ;; label = @15
                                  block  ;; label = @16
                                    block  ;; label = @17
                                      block  ;; label = @18
                                        block  ;; label = @19
                                          block  ;; label = @20
                                            block  ;; label = @21
                                              block  ;; label = @22
                                                block  ;; label = @23
                                                  block  ;; label = @24
                                                    block  ;; label = @25
                                                      block  ;; label = @26
                                                        block  ;; label = @27
                                                          block  ;; label = @28
                                                            block  ;; label = @29
                                                              block  ;; label = @30
                                                                block  ;; label = @31
                                                                  block  ;; label = @32
                                                                    block  ;; label = @33
                                                                      block  ;; label = @34
                                                                        block  ;; label = @35
                                                                          block  ;; label = @36
                                                                            block  ;; label = @37
                                                                              block  ;; label = @38
                                                                                block  ;; label = @39
                                                                                  block  ;; label = @40
                                                                                    block  ;; label = @41
                                                                                      block  ;; label = @42
                                                                                        block  ;; label = @43
                                                                                          block  ;; label = @44
                                                                                            block  ;; label = @45
                                                                                              block  ;; label = @46
                                                                                                block  ;; label = @47
                                                                                                  block  ;; label = @48
                                                                                                    block  ;; label = @49
                                                                                                      block  ;; label = @50
                                                                                                        block  ;; label = @51
                                                                                                          block  ;; label = @52
                                                                                                            local.get 0
                                                                                                            br_table 51 (;@1;) 50 (;@2;) 0 (;@52;) 1 (;@51;) 2 (;@50;) 3 (;@49;) 4 (;@48;) 5 (;@47;) 6 (;@46;) 7 (;@45;) 8 (;@44;) 9 (;@43;) 10 (;@42;) 11 (;@41;) 12 (;@40;) 13 (;@39;) 14 (;@38;) 15 (;@37;) 16 (;@36;) 17 (;@35;) 18 (;@34;) 19 (;@33;) 20 (;@32;) 21 (;@31;) 22 (;@30;) 23 (;@29;) 24 (;@28;) 25 (;@27;) 26 (;@26;) 27 (;@25;) 28 (;@24;) 29 (;@23;) 30 (;@22;) 31 (;@21;) 32 (;@20;) 33 (;@19;) 34 (;@18;) 35 (;@17;) 36 (;@16;) 37 (;@15;) 38 (;@14;) 39 (;@13;) 40 (;@12;) 41 (;@11;) 42 (;@10;) 43 (;@9;) 44 (;@8;) 45 (;@7;) 46 (;@6;) 47 (;@5;) 48 (;@4;) 49 (;@3;)
                                                                                                          end
                                                                                                          i32.const 1
                                                                                                          local.set 4
                                                                                                          i32.const 0
                                                                                                          local.set 3
                                                                                                          br 49 (;@2;)
                                                                                                        end
                                                                                                        i32.const 2
                                                                                                        local.set 4
                                                                                                        i32.const 0
                                                                                                        local.set 3
                                                                                                        br 48 (;@2;)
                                                                                                      end
                                                                                                      i32.const 3
                                                                                                      local.set 4
                                                                                                      i32.const 0
                                                                                                      local.set 3
                                                                                                      br 47 (;@2;)
                                                                                                    end
                                                                                                    i32.const 4
                                                                                                    local.set 4
                                                                                                    i32.const 0
                                                                                                    local.set 3
                                                                                                    br 46 (;@2;)
                                                                                                  end
                                                                                                  i32.const 5
                                                                                                  local.set 4
                                                                                                  i32.const 0
                                                                                                  local.set 3
                                                                                                  br 45 (;@2;)
                                                                                                end
                                                                                                i32.const 6
                                                                                                local.set 4
                                                                                                i32.const 0
                                                                                                local.set 3
                                                                                                br 44 (;@2;)
                                                                                              end
                                                                                              i32.const 7
                                                                                              local.set 4
                                                                                              i32.const 0
                                                                                              local.set 3
                                                                                              br 43 (;@2;)
                                                                                            end
                                                                                            i32.const 8
                                                                                            local.set 4
                                                                                            i32.const 0
                                                                                            local.set 3
                                                                                            br 42 (;@2;)
                                                                                          end
                                                                                          i32.const 9
                                                                                          local.set 4
                                                                                          i32.const 0
                                                                                          local.set 3
                                                                                          br 41 (;@2;)
                                                                                        end
                                                                                        i32.const 10
                                                                                        local.set 4
                                                                                        i32.const 0
                                                                                        local.set 3
                                                                                        br 40 (;@2;)
                                                                                      end
                                                                                      i32.const 11
                                                                                      local.set 4
                                                                                      i32.const 0
                                                                                      local.set 3
                                                                                      br 39 (;@2;)
                                                                                    end
                                                                                    i32.const 12
                                                                                    local.set 4
                                                                                    i32.const 0
                                                                                    local.set 3
                                                                                    br 38 (;@2;)
                                                                                  end
                                                                                  i32.const 13
                                                                                  local.set 4
                                                                                  i32.const 0
                                                                                  local.set 3
                                                                                  br 37 (;@2;)
                                                                                end
                                                                                i32.const 14
                                                                                local.set 4
                                                                                i32.const 0
                                                                                local.set 3
                                                                                br 36 (;@2;)
                                                                              end
                                                                              i32.const 15
                                                                              local.set 4
                                                                              i32.const 0
                                                                              local.set 3
                                                                              br 35 (;@2;)
                                                                            end
                                                                            i32.const 16
                                                                            local.set 4
                                                                            i32.const 0
                                                                            local.set 3
                                                                            br 34 (;@2;)
                                                                          end
                                                                          i32.const 17
                                                                          local.set 4
                                                                          i32.const 0
                                                                          local.set 3
                                                                          br 33 (;@2;)
                                                                        end
                                                                        i32.const 18
                                                                        local.set 4
                                                                        i32.const 0
                                                                        local.set 3
                                                                        br 32 (;@2;)
                                                                      end
                                                                      i32.const 19
                                                                      local.set 4
                                                                      i32.const 0
                                                                      local.set 3
                                                                      br 31 (;@2;)
                                                                    end
                                                                    i32.const 20
                                                                    local.set 4
                                                                    i32.const 0
                                                                    local.set 3
                                                                    br 30 (;@2;)
                                                                  end
                                                                  i32.const 21
                                                                  local.set 4
                                                                  i32.const 0
                                                                  local.set 3
                                                                  br 29 (;@2;)
                                                                end
                                                                i32.const 22
                                                                local.set 4
                                                                i32.const 0
                                                                local.set 3
                                                                br 28 (;@2;)
                                                              end
                                                              i32.const 23
                                                              local.set 4
                                                              i32.const 0
                                                              local.set 3
                                                              br 27 (;@2;)
                                                            end
                                                            i32.const 24
                                                            local.set 4
                                                            i32.const 0
                                                            local.set 3
                                                            br 26 (;@2;)
                                                          end
                                                          i32.const 25
                                                          local.set 4
                                                          i32.const 0
                                                          local.set 3
                                                          br 25 (;@2;)
                                                        end
                                                        i32.const 26
                                                        local.set 4
                                                        i32.const 0
                                                        local.set 3
                                                        br 24 (;@2;)
                                                      end
                                                      i32.const 27
                                                      local.set 4
                                                      i32.const 0
                                                      local.set 3
                                                      br 23 (;@2;)
                                                    end
                                                    i32.const 28
                                                    local.set 4
                                                    i32.const 0
                                                    local.set 3
                                                    br 22 (;@2;)
                                                  end
                                                  i32.const 29
                                                  local.set 4
                                                  i32.const 0
                                                  local.set 3
                                                  br 21 (;@2;)
                                                end
                                                i32.const 30
                                                local.set 4
                                                i32.const 0
                                                local.set 3
                                                br 20 (;@2;)
                                              end
                                              i32.const 31
                                              local.set 4
                                              i32.const 0
                                              local.set 3
                                              br 19 (;@2;)
                                            end
                                            i32.const 32
                                            local.set 4
                                            i32.const 0
                                            local.set 3
                                            br 18 (;@2;)
                                          end
                                          i32.const 33
                                          local.set 4
                                          i32.const 0
                                          local.set 3
                                          br 17 (;@2;)
                                        end
                                        i32.const 34
                                        local.set 4
                                        i32.const 0
                                        local.set 3
                                        br 16 (;@2;)
                                      end
                                      i32.const 35
                                      local.set 4
                                      i32.const 0
                                      local.set 3
                                      br 15 (;@2;)
                                    end
                                    i32.const 36
                                    local.set 4
                                    i32.const 0
                                    local.set 3
                                    br 14 (;@2;)
                                  end
                                  i32.const 37
                                  local.set 4
                                  i32.const 0
                                  local.set 3
                                  br 13 (;@2;)
                                end
                                i32.const 38
                                local.set 4
                                i32.const 0
                                local.set 3
                                br 12 (;@2;)
                              end
                              i32.const 39
                              local.set 4
                              i32.const 0
                              local.set 3
                              br 11 (;@2;)
                            end
                            i32.const 45
                            local.set 4
                            i32.const 0
                            local.set 3
                            br 10 (;@2;)
                          end
                          i32.const 46
                          local.set 4
                          i32.const 0
                          local.set 3
                          br 9 (;@2;)
                        end
                        i32.const 47
                        local.set 4
                        i32.const 0
                        local.set 3
                        br 8 (;@2;)
                      end
                      i32.const 48
                      local.set 4
                      i32.const 0
                      local.set 3
                      br 7 (;@2;)
                    end
                    i32.const 49
                    local.set 4
                    i32.const 0
                    local.set 3
                    br 6 (;@2;)
                  end
                  i32.const 50
                  local.set 4
                  i32.const 0
                  local.set 3
                  br 5 (;@2;)
                end
                i32.const 51
                local.set 4
                i32.const 0
                local.set 3
                br 4 (;@2;)
              end
              i32.const 52
              local.set 4
              i32.const 0
              local.set 3
              br 3 (;@2;)
            end
            i32.const 53
            local.set 4
            i32.const 0
            local.set 3
            br 2 (;@2;)
          end
          i32.const 54
          local.set 4
          i32.const 0
          local.set 3
          br 1 (;@2;)
        end
        block  ;; label = @3
          block  ;; label = @4
            block  ;; label = @5
              block  ;; label = @6
                local.get 0
                i32.const -65536
                i32.and
                i32.const 65536
                i32.eq
                br_if 0 (;@6;)
                local.get 0
                i32.const -256
                i32.and
                local.tee 2
                i32.const 64768
                i32.eq
                br_if 1 (;@5;)
                local.get 2
                i32.const 65024
                i32.eq
                br_if 2 (;@4;)
                i32.const 43
                local.set 4
                i32.const 0
                local.set 3
                local.get 0
                local.set 1
                local.get 2
                i32.const 65280
                i32.eq
                br_if 4 (;@2;)
                i32.const 40
                i32.const 30
                local.get 2
                i32.const 64512
                i32.eq
                local.tee 2
                select
                local.set 4
                i32.const 0
                local.set 3
                local.get 0
                i32.const 0
                local.get 2
                select
                local.set 1
                br 4 (;@2;)
              end
              local.get 0
              i32.const 16
              i32.shl
              local.set 3
              i32.const 44
              local.set 4
              br 3 (;@2;)
            end
            i32.const 41
            local.set 4
            br 1 (;@3;)
          end
          i32.const 42
          local.set 4
        end
        i32.const 0
        local.set 3
        local.get 0
        local.set 1
      end
      local.get 4
      local.get 3
      i32.or
      local.get 1
      i32.const 8
      i32.shl
      i32.const 65280
      i32.and
      i32.or
      local.set 2
    end
    local.get 2)
  (func (;24;) (type 8) (param i32 i32)
    block  ;; label = @1
      local.get 1
      i32.load
      i32.const -2147483648
      i32.ne
      br_if 0 (;@1;)
      local.get 1
      i32.load offset=4
      call 11
      unreachable
    end
    local.get 0
    local.get 1
    i64.load align=4
    i64.store align=4
    local.get 0
    i32.const 8
    i32.add
    local.get 1
    i32.const 8
    i32.add
    i32.load
    i32.store)
  (func (;25;) (type 10) (param i32 i32 i32)
    (local i32)
    global.get 0
    i32.const 16
    i32.sub
    local.tee 3
    global.set 0
    local.get 3
    local.get 1
    local.get 2
    i32.const 32
    call 26
    block  ;; label = @1
      block  ;; label = @2
        local.get 3
        i32.load
        local.tee 2
        br_if 0 (;@2;)
        local.get 0
        local.get 3
        i32.load8_u offset=4
        i32.store8
        i32.const 0
        local.set 1
        br 1 (;@1;)
      end
      local.get 3
      i32.load offset=8
      local.set 1
      local.get 0
      local.get 3
      i32.load offset=12
      i32.store offset=36
      local.get 0
      i32.const 24
      i32.add
      local.get 2
      i32.const 24
      i32.add
      i64.load align=1
      i64.store align=1
      local.get 0
      i32.const 16
      i32.add
      local.get 2
      i32.const 16
      i32.add
      i64.load align=1
      i64.store align=1
      local.get 0
      i32.const 8
      i32.add
      local.get 2
      i32.const 8
      i32.add
      i64.load align=1
      i64.store align=1
      local.get 0
      local.get 2
      i64.load align=1
      i64.store align=1
    end
    local.get 0
    local.get 1
    i32.store offset=32
    local.get 3
    i32.const 16
    i32.add
    global.set 0)
  (func (;26;) (type 0) (param i32 i32 i32 i32)
    block  ;; label = @1
      block  ;; label = @2
        local.get 2
        local.get 3
        i32.lt_u
        br_if 0 (;@2;)
        local.get 0
        local.get 3
        i32.store offset=4
        local.get 0
        local.get 2
        local.get 3
        i32.sub
        i32.store offset=12
        local.get 0
        local.get 1
        local.get 3
        i32.add
        i32.store offset=8
        br 1 (;@1;)
      end
      i32.const 0
      local.set 1
      local.get 0
      i32.const 0
      i32.store8 offset=4
    end
    local.get 0
    local.get 1
    i32.store)
  (func (;27;) (type 11) (param i32 i32 i32 i32 i32)
    block  ;; label = @1
      local.get 1
      local.get 3
      i32.gt_u
      br_if 0 (;@1;)
      local.get 0
      local.get 1
      i32.store offset=4
      local.get 0
      local.get 2
      i32.store
      return
    end
    i32.const 0
    local.get 1
    local.get 3
    local.get 4
    call 57
    unreachable)
  (func (;28;) (type 11) (param i32 i32 i32 i32 i32)
    block  ;; label = @1
      local.get 1
      local.get 3
      i32.ne
      br_if 0 (;@1;)
      block  ;; label = @2
        local.get 1
        i32.eqz
        br_if 0 (;@2;)
        local.get 0
        local.get 2
        local.get 1
        call $memcpy
      end
      return
    end
    local.get 1
    local.get 3
    local.get 4
    call 72
    unreachable)
  (func (;29;) (type 9)
    i32.const 1049480
    i32.const 77
    i32.const 1049464
    call 52
    unreachable)
  (func (;30;) (type 8) (param i32 i32)
    (local i32)
    global.get 0
    i32.const 16
    i32.sub
    local.tee 2
    global.set 0
    local.get 2
    i32.const 4
    i32.add
    local.get 1
    call 18
    local.get 2
    i32.load offset=8
    local.set 1
    block  ;; label = @1
      local.get 2
      i32.load offset=4
      i32.const 1
      i32.ne
      br_if 0 (;@1;)
      local.get 1
      local.get 2
      i32.load offset=12
      call 19
      unreachable
    end
    local.get 0
    local.get 2
    i32.load offset=12
    i32.store offset=4
    local.get 0
    local.get 1
    i32.store
    local.get 2
    i32.const 16
    i32.add
    global.set 0)
  (func (;31;) (type 4) (param i32)
    block  ;; label = @1
      local.get 0
      i32.const 255
      i32.and
      i32.const 55
      i32.eq
      br_if 0 (;@1;)
      local.get 0
      call 11
      unreachable
    end)
  (func (;32;) (type 8) (param i32 i32)
    (local i32 i32 i32 i32 i32 i32 i32 i64 i64 i32 i32 i32)
    global.get 0
    i32.const 112
    i32.sub
    local.tee 2
    global.set 0
    local.get 2
    i32.const 40
    i32.add
    local.get 1
    i32.load offset=4
    local.tee 3
    local.get 1
    i32.load offset=8
    call 25
    local.get 2
    i32.load8_u offset=40
    local.set 4
    block  ;; label = @1
      block  ;; label = @2
        block  ;; label = @3
          local.get 2
          i32.load offset=72
          local.tee 5
          i32.eqz
          br_if 0 (;@3;)
          local.get 2
          i32.const 103
          i32.add
          local.get 2
          i32.const 64
          i32.add
          i64.load align=1
          i64.store align=1
          local.get 2
          i32.const 96
          i32.add
          local.get 2
          i32.const 57
          i32.add
          i64.load align=1
          i64.store
          local.get 2
          i32.const 80
          i32.add
          i32.const 8
          i32.add
          local.get 2
          i32.const 49
          i32.add
          i64.load align=1
          i64.store
          local.get 2
          local.get 2
          i64.load offset=41 align=1
          i64.store offset=80
          block  ;; label = @4
            local.get 2
            i32.load offset=76
            local.tee 6
            br_if 0 (;@4;)
            i32.const 0
            local.set 4
            br 1 (;@3;)
          end
          local.get 5
          i32.load8_u
          local.tee 5
          i32.const 8
          i32.lt_u
          br_if 1 (;@2;)
          i32.const 1
          local.set 4
        end
        local.get 0
        i32.const 1
        i32.store8
        local.get 0
        local.get 4
        i32.store8 offset=1
        br 1 (;@1;)
      end
      local.get 2
      i32.const 8
      i32.add
      i32.const 23
      i32.add
      local.tee 7
      local.get 2
      i32.const 80
      i32.add
      i32.const 23
      i32.add
      i64.load align=1
      i64.store align=1
      local.get 2
      i32.const 8
      i32.add
      i32.const 16
      i32.add
      local.tee 8
      local.get 2
      i32.const 80
      i32.add
      i32.const 16
      i32.add
      i64.load
      i64.store
      local.get 2
      i32.const 8
      i32.add
      i32.const 8
      i32.add
      local.get 2
      i32.const 80
      i32.add
      i32.const 8
      i32.add
      i64.load
      local.tee 9
      i64.store
      local.get 2
      local.get 2
      i64.load offset=80
      local.tee 10
      i64.store offset=8
      local.get 2
      i32.const 40
      i32.add
      i32.const 23
      i32.add
      local.tee 11
      local.get 7
      i64.load align=1
      i64.store align=1
      local.get 2
      i32.const 40
      i32.add
      i32.const 16
      i32.add
      local.tee 12
      local.get 8
      i64.load
      i64.store
      local.get 2
      i32.const 40
      i32.add
      i32.const 8
      i32.add
      local.tee 13
      local.get 9
      i64.store
      local.get 2
      local.get 10
      i64.store offset=40
      i32.const 1
      local.set 7
      i32.const 2
      local.set 8
      block  ;; label = @2
        local.get 6
        i32.const 1
        i32.ne
        br_if 0 (;@2;)
        local.get 0
        local.get 2
        i64.load offset=40
        i64.store offset=2 align=1
        local.get 0
        local.get 5
        i32.store8 offset=33
        local.get 0
        i32.const 25
        i32.add
        local.get 11
        i64.load align=1
        i64.store align=1
        local.get 0
        i32.const 18
        i32.add
        local.get 12
        i64.load
        i64.store align=1
        local.get 0
        i32.const 10
        i32.add
        local.get 13
        i64.load
        i64.store align=1
        i32.const 0
        local.set 7
        local.get 4
        local.set 8
      end
      local.get 0
      local.get 7
      i32.store8
      local.get 0
      local.get 8
      i32.store8 offset=1
    end
    local.get 1
    i32.load
    local.get 3
    call 9
    local.get 2
    i32.const 112
    i32.add
    global.set 0)
  (func (;33;) (type 8) (param i32 i32)
    (local i32)
    local.get 1
    i32.const 1
    i32.add
    local.set 2
    block  ;; label = @1
      local.get 1
      i32.load8_u
      i32.const 1
      i32.eq
      br_if 0 (;@1;)
      block  ;; label = @2
        i32.const 33
        i32.eqz
        br_if 0 (;@2;)
        local.get 0
        local.get 2
        i32.const 33
        call $memcpy
      end
      return
    end
    local.get 2
    i32.load8_u
    call 55
    call 11
    unreachable)
  (func (;34;) (type 8) (param i32 i32)
    (local i32)
    global.get 0
    i32.const 32
    i32.sub
    local.tee 2
    global.set 0
    local.get 2
    i32.const 20
    i32.add
    local.get 1
    call 37
    local.get 2
    i32.const 8
    i32.add
    local.get 2
    i32.const 20
    i32.add
    call 36
    local.get 0
    local.get 2
    i64.load offset=12 align=4
    i64.store align=4
    local.get 0
    local.get 2
    i64.load offset=8 align=4
    i64.store offset=8 align=4
    local.get 0
    i32.const 16
    i32.add
    local.get 2
    i32.const 16
    i32.add
    i32.load
    i32.store
    local.get 2
    i32.const 32
    i32.add
    global.set 0)
  (func (;35;) (type 8) (param i32 i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i32)
    global.get 0
    i32.const 144
    i32.sub
    local.tee 2
    global.set 0
    i32.const 64
    local.set 3
    i32.const 0
    local.set 4
    block  ;; label = @1
      i32.const 64
      i32.eqz
      br_if 0 (;@1;)
      local.get 2
      i32.const 40
      i32.add
      i32.const 0
      i32.const 64
      call $memset
    end
    block  ;; label = @1
      loop  ;; label = @2
        local.get 3
        i32.eqz
        br_if 1 (;@1;)
        local.get 2
        i32.const 32
        i32.add
        i32.const 8
        local.get 2
        i32.const 40
        i32.add
        local.get 4
        i32.add
        local.get 3
        i32.const 1049520
        call 27
        local.get 2
        i32.load offset=36
        local.set 5
        local.get 2
        i32.load offset=32
        local.set 6
        local.get 2
        local.get 1
        local.get 4
        i32.add
        i64.load
        i64.store offset=128
        local.get 6
        local.get 5
        local.get 2
        i32.const 128
        i32.add
        i32.const 8
        i32.const 1049536
        call 28
        local.get 3
        i32.const -8
        i32.add
        local.set 3
        local.get 4
        i32.const 8
        i32.add
        local.set 4
        br 0 (;@2;)
      end
    end
    i32.const 0
    local.set 3
    local.get 2
    i32.const 0
    i32.store8 offset=112
    local.get 2
    local.get 2
    i32.const 104
    i32.add
    i32.store offset=108
    local.get 2
    local.get 2
    i32.const 40
    i32.add
    i32.store offset=104
    local.get 2
    i32.const 24
    i32.add
    local.get 2
    i32.const 104
    i32.add
    call 63
    block  ;; label = @1
      block  ;; label = @2
        local.get 2
        i32.load8_u offset=24
        i32.eqz
        br_if 0 (;@2;)
        local.get 2
        i32.load8_u offset=25
        local.set 3
        local.get 2
        i32.const 16
        i32.add
        i32.const 8
        call 30
        local.get 2
        i32.load offset=16
        local.set 4
        local.get 2
        i32.load offset=20
        local.tee 5
        local.get 3
        i32.store8
        local.get 2
        i32.const 1
        i32.store offset=124
        local.get 2
        local.get 5
        i32.store offset=120
        local.get 2
        local.get 4
        i32.store offset=116
        local.get 2
        i32.const 128
        i32.add
        i32.const 8
        i32.add
        local.get 2
        i32.const 104
        i32.add
        i32.const 8
        i32.add
        i32.load
        i32.store
        local.get 2
        local.get 2
        i64.load offset=104 align=4
        i64.store offset=128
        i32.const 1
        local.set 3
        block  ;; label = @3
          loop  ;; label = @4
            local.get 2
            i32.const 8
            i32.add
            local.get 2
            i32.const 128
            i32.add
            call 63
            local.get 2
            i32.load8_u offset=8
            i32.eqz
            br_if 1 (;@3;)
            local.get 2
            i32.load8_u offset=9
            local.set 4
            block  ;; label = @5
              local.get 3
              local.get 2
              i32.load offset=116
              i32.ne
              br_if 0 (;@5;)
              local.get 2
              i32.const 116
              i32.add
              i32.const 1
              call 61
              local.get 2
              i32.load offset=120
              local.set 5
            end
            local.get 5
            local.get 3
            i32.add
            local.get 4
            i32.store8
            local.get 2
            local.get 3
            i32.const 1
            i32.add
            local.tee 3
            i32.store offset=124
            br 0 (;@4;)
          end
        end
        local.get 2
        i32.load offset=124
        local.set 3
        br 1 (;@1;)
      end
      local.get 2
      i32.const 0
      i32.store offset=124
      local.get 2
      i64.const 4294967296
      i64.store offset=116 align=4
    end
    local.get 2
    i32.const 116
    i32.add
    local.get 3
    call 58
    local.get 2
    i32.const 128
    i32.add
    local.get 2
    i32.load offset=120
    local.tee 4
    local.get 2
    i32.load offset=124
    local.tee 5
    i32.const 1
    i32.shr_u
    local.tee 3
    local.get 3
    i32.const 1049388
    call 60
    local.get 2
    i32.load offset=132
    local.set 7
    local.get 2
    i32.load offset=128
    local.set 8
    local.get 2
    i32.const 128
    i32.add
    local.get 4
    local.get 5
    i32.add
    local.get 3
    i32.sub
    local.get 3
    local.get 3
    i32.const 1049404
    call 60
    local.get 2
    i32.load offset=132
    local.set 9
    local.get 2
    i32.load offset=128
    local.set 10
    i32.const 0
    local.set 4
    local.get 3
    i32.const -1
    i32.add
    local.tee 11
    local.set 3
    block  ;; label = @1
      block  ;; label = @2
        loop  ;; label = @3
          local.get 3
          i32.const -1
          i32.eq
          br_if 1 (;@2;)
          local.get 7
          local.get 4
          i32.eq
          br_if 2 (;@1;)
          block  ;; label = @4
            local.get 11
            local.get 9
            i32.ge_u
            br_if 0 (;@4;)
            local.get 8
            local.get 4
            i32.add
            local.tee 5
            i32.load8_u
            local.set 6
            local.get 5
            local.get 10
            local.get 3
            i32.add
            local.tee 1
            i32.load8_u
            i32.store8
            local.get 1
            local.get 6
            i32.store8
            local.get 3
            i32.const -1
            i32.add
            local.set 3
            local.get 4
            i32.const 1
            i32.add
            local.set 4
            br 1 (;@3;)
          end
        end
        local.get 3
        local.get 9
        i32.const 1049436
        call 64
        unreachable
      end
      local.get 0
      local.get 2
      i64.load offset=116 align=4
      i64.store align=4
      local.get 0
      i32.const 8
      i32.add
      local.get 2
      i32.const 116
      i32.add
      i32.const 8
      i32.add
      i32.load
      i32.store
      local.get 2
      i32.const 144
      i32.add
      global.set 0
      return
    end
    local.get 7
    local.get 7
    i32.const 1049420
    call 64
    unreachable)
  (func (;36;) (type 8) (param i32 i32)
    block  ;; label = @1
      local.get 1
      i32.load
      i32.const -2147483648
      i32.ne
      br_if 0 (;@1;)
      local.get 1
      i32.load8_u offset=4
      call 55
      call 11
      unreachable
    end
    local.get 0
    local.get 1
    i64.load align=4
    i64.store align=4
    local.get 0
    i32.const 8
    i32.add
    local.get 1
    i32.const 8
    i32.add
    i32.load
    i32.store)
  (func (;37;) (type 8) (param i32 i32)
    (local i32 i32 i32 i32 i32)
    global.get 0
    i32.const 48
    i32.sub
    local.tee 2
    global.set 0
    local.get 2
    i32.const 16
    i32.add
    i32.const 33
    call 30
    local.get 2
    i32.const 0
    i32.store offset=32
    local.get 2
    local.get 2
    i32.load offset=20
    local.tee 3
    i32.store offset=28
    local.get 2
    local.get 2
    i32.load offset=16
    local.tee 4
    i32.store offset=24
    local.get 2
    i32.const 8
    i32.add
    i32.const 32
    call 30
    local.get 2
    i32.load offset=8
    local.set 5
    local.get 2
    i32.load offset=12
    local.tee 6
    local.get 1
    i64.load align=1
    i64.store align=1
    local.get 6
    i32.const 24
    i32.add
    local.get 1
    i32.const 24
    i32.add
    i64.load align=1
    i64.store align=1
    local.get 6
    i32.const 16
    i32.add
    local.get 1
    i32.const 16
    i32.add
    i64.load align=1
    i64.store align=1
    local.get 6
    i32.const 8
    i32.add
    local.get 1
    i32.const 8
    i32.add
    i64.load align=1
    i64.store align=1
    block  ;; label = @1
      block  ;; label = @2
        block  ;; label = @3
          local.get 5
          i32.const -2147483648
          i32.eq
          br_if 0 (;@3;)
          local.get 2
          local.get 6
          i32.store8 offset=40
          local.get 2
          i32.const 43
          i32.add
          local.tee 3
          local.get 6
          i32.const 24
          i32.shr_u
          i32.store8
          local.get 2
          i32.const 32
          i32.store offset=44
          local.get 2
          local.get 5
          i32.store offset=36
          local.get 2
          local.get 6
          i32.const 8
          i32.shr_u
          i32.store16 offset=41 align=1
          local.get 2
          i32.const 24
          i32.add
          local.get 2
          i32.const 36
          i32.add
          call 41
          local.get 2
          i32.load offset=36
          local.get 2
          i32.load offset=40
          call 9
          local.get 1
          i32.load8_u offset=32
          local.set 1
          i32.const 1
          i32.const 1
          call 13
          local.tee 6
          i32.eqz
          br_if 1 (;@2;)
          local.get 6
          local.get 1
          i32.store8
          local.get 3
          local.get 6
          i32.const 24
          i32.shr_u
          i32.store8
          local.get 2
          i32.const 1
          i32.store offset=44
          local.get 2
          local.get 6
          i32.store8 offset=40
          local.get 2
          i32.const 1
          i32.store offset=36
          local.get 2
          local.get 6
          i32.const 8
          i32.shr_u
          i32.store16 offset=41 align=1
          local.get 2
          i32.const 24
          i32.add
          local.get 2
          i32.const 36
          i32.add
          call 41
          local.get 2
          i32.load offset=36
          local.get 2
          i32.load offset=40
          call 9
          local.get 0
          i32.const 8
          i32.add
          local.get 2
          i32.const 24
          i32.add
          i32.const 8
          i32.add
          i32.load
          i32.store
          local.get 0
          local.get 2
          i64.load offset=24 align=4
          i64.store align=4
          br 2 (;@1;)
        end
        local.get 0
        i32.const -2147483648
        i32.store
        local.get 0
        local.get 6
        i32.store8 offset=4
        local.get 4
        local.get 3
        call 9
        br 1 (;@1;)
      end
      call 46
      unreachable
    end
    local.get 2
    i32.const 48
    i32.add
    global.set 0)
  (func (;38;) (type 10) (param i32 i32 i32)
    (local i32 i32)
    global.get 0
    i32.const 32
    i32.sub
    local.tee 3
    global.set 0
    local.get 3
    i32.const 8
    i32.add
    local.get 2
    i32.const 4
    i32.add
    call 30
    local.get 3
    i32.const 16
    i32.add
    i32.const 8
    i32.add
    local.tee 4
    i32.const 0
    i32.store
    local.get 3
    local.get 3
    i64.load offset=8
    i64.store offset=16 align=4
    local.get 3
    local.get 2
    i32.store offset=28
    local.get 3
    i32.const 16
    i32.add
    local.get 3
    i32.const 28
    i32.add
    i32.const 4
    call 62
    local.get 3
    i32.const 16
    i32.add
    local.get 1
    local.get 2
    call 62
    local.get 0
    i32.const 8
    i32.add
    local.get 4
    i32.load
    i32.store
    local.get 0
    local.get 3
    i64.load offset=16 align=4
    i64.store align=4
    local.get 3
    i32.const 32
    i32.add
    global.set 0)
  (func (;39;) (type 2) (param i32) (result i32)
    local.get 0
    i32.load offset=36
    local.get 0
    call 65
    local.get 0
    i32.load offset=24
    i32.add
    i32.add
    i32.const 8
    i32.add)
  (func (;40;) (type 8) (param i32 i32)
    (local i32 i32 i32)
    global.get 0
    i32.const 16
    i32.sub
    local.tee 2
    global.set 0
    local.get 2
    i32.const 8
    i32.add
    i32.const 4
    call 30
    local.get 2
    i32.load offset=8
    local.set 3
    local.get 0
    local.get 2
    i32.load offset=12
    local.tee 4
    i32.store offset=4
    local.get 0
    local.get 3
    i32.store
    local.get 4
    local.get 1
    i32.store align=1
    local.get 0
    i32.const 4
    i32.store offset=8
    local.get 2
    i32.const 16
    i32.add
    global.set 0)
  (func (;41;) (type 8) (param i32 i32)
    (local i32 i32 i32)
    local.get 1
    i32.load offset=4
    local.set 2
    local.get 0
    local.get 1
    i32.load offset=8
    local.tee 3
    call 61
    local.get 0
    i32.load offset=8
    local.set 4
    block  ;; label = @1
      local.get 3
      i32.eqz
      br_if 0 (;@1;)
      local.get 0
      i32.load offset=4
      local.get 4
      i32.add
      local.get 2
      local.get 3
      call $memcpy
    end
    local.get 1
    i32.const 0
    i32.store offset=8
    local.get 0
    local.get 4
    local.get 3
    i32.add
    i32.store offset=8)
  (func (;42;) (type 8) (param i32 i32)
    (local i32)
    block  ;; label = @1
      block  ;; label = @2
        block  ;; label = @3
          block  ;; label = @4
            block  ;; label = @5
              block  ;; label = @6
                block  ;; label = @7
                  block  ;; label = @8
                    block  ;; label = @9
                      block  ;; label = @10
                        block  ;; label = @11
                          block  ;; label = @12
                            block  ;; label = @13
                              block  ;; label = @14
                                block  ;; label = @15
                                  block  ;; label = @16
                                    block  ;; label = @17
                                      block  ;; label = @18
                                        block  ;; label = @19
                                          block  ;; label = @20
                                            block  ;; label = @21
                                              block  ;; label = @22
                                                block  ;; label = @23
                                                  local.get 1
                                                  i32.load
                                                  br_table 0 (;@23;) 1 (;@22;) 2 (;@21;) 3 (;@20;) 4 (;@19;) 5 (;@18;) 6 (;@17;) 7 (;@16;) 8 (;@15;) 9 (;@14;) 10 (;@13;) 11 (;@12;) 12 (;@11;) 13 (;@10;) 14 (;@9;) 15 (;@8;) 16 (;@7;) 17 (;@6;) 18 (;@5;) 19 (;@4;) 20 (;@3;) 21 (;@2;) 22 (;@1;) 0 (;@23;)
                                                end
                                                local.get 0
                                                i32.const 0
                                                i32.store
                                                return
                                              end
                                              local.get 0
                                              i32.const 1
                                              i32.store
                                              return
                                            end
                                            local.get 0
                                            i32.const 2
                                            i32.store
                                            return
                                          end
                                          local.get 0
                                          i32.const 3
                                          i32.store
                                          return
                                        end
                                        local.get 0
                                        i32.const 4
                                        i32.store
                                        return
                                      end
                                      local.get 0
                                      i32.const 5
                                      i32.store
                                      return
                                    end
                                    local.get 0
                                    i32.const 6
                                    i32.store
                                    return
                                  end
                                  local.get 0
                                  i32.const 7
                                  i32.store
                                  return
                                end
                                local.get 0
                                i32.const 8
                                i32.store
                                return
                              end
                              local.get 0
                              i32.const 9
                              i32.store
                              return
                            end
                            local.get 0
                            i32.const 10
                            i32.store
                            return
                          end
                          local.get 0
                          i32.const 11
                          i32.store
                          return
                        end
                        local.get 0
                        i32.const 12
                        i32.store
                        return
                      end
                      local.get 0
                      i32.const 13
                      i32.store
                      return
                    end
                    local.get 1
                    i32.const 4
                    i32.add
                    call 66
                    local.set 1
                    local.get 0
                    i32.const 14
                    i32.store
                    local.get 0
                    local.get 1
                    i32.store offset=4
                    return
                  end
                  local.get 1
                  i32.const 4
                  i32.add
                  call 66
                  local.set 1
                  local.get 0
                  i32.const 15
                  i32.store
                  local.get 0
                  local.get 1
                  i32.store offset=4
                  return
                end
                local.get 0
                local.get 1
                i64.load align=4
                i64.store align=4
                local.get 0
                i32.const 8
                i32.add
                local.get 1
                i32.const 8
                i32.add
                i64.load align=4
                i64.store align=4
                return
              end
              local.get 1
              i32.const 4
              i32.add
              call 66
              local.set 2
              local.get 0
              local.get 1
              i32.const 8
              i32.add
              call 66
              i32.store offset=8
              local.get 0
              local.get 2
              i32.store offset=4
              local.get 0
              i32.const 17
              i32.store
              return
            end
            local.get 1
            i32.const 4
            i32.add
            call 66
            local.set 2
            local.get 0
            local.get 1
            i32.const 8
            i32.add
            call 66
            i32.store offset=8
            local.get 0
            local.get 2
            i32.store offset=4
            local.get 0
            i32.const 18
            i32.store
            return
          end
          local.get 0
          i32.const 4
          i32.add
          i32.const 1
          local.get 1
          i32.const 4
          i32.add
          call 67
          local.get 0
          i32.const 19
          i32.store
          return
        end
        local.get 0
        i32.const 4
        i32.add
        i32.const 2
        local.get 1
        i32.const 4
        i32.add
        call 67
        local.get 0
        i32.const 20
        i32.store
        return
      end
      local.get 0
      i32.const 4
      i32.add
      i32.const 3
      local.get 1
      i32.const 4
      i32.add
      call 67
      local.get 0
      i32.const 21
      i32.store
      return
    end
    local.get 0
    i32.const 22
    i32.store)
  (func (;43;) (type 1) (param i32 i32) (result i32)
    (local i32 i32 i32)
    global.get 0
    i32.const 32
    i32.sub
    local.tee 2
    global.set 0
    loop (result i32)  ;; label = @1
      i32.const 14
      local.set 3
      block  ;; label = @2
        block  ;; label = @3
          block  ;; label = @4
            block  ;; label = @5
              block  ;; label = @6
                block  ;; label = @7
                  block  ;; label = @8
                    block  ;; label = @9
                      block  ;; label = @10
                        block  ;; label = @11
                          block  ;; label = @12
                            block  ;; label = @13
                              block  ;; label = @14
                                block  ;; label = @15
                                  block  ;; label = @16
                                    block  ;; label = @17
                                      block  ;; label = @18
                                        block  ;; label = @19
                                          block  ;; label = @20
                                            block  ;; label = @21
                                              block  ;; label = @22
                                                block  ;; label = @23
                                                  block  ;; label = @24
                                                    block  ;; label = @25
                                                      block  ;; label = @26
                                                        block  ;; label = @27
                                                          block  ;; label = @28
                                                            local.get 0
                                                            i32.load
                                                            br_table 0 (;@28;) 1 (;@27;) 2 (;@26;) 3 (;@25;) 4 (;@24;) 5 (;@23;) 6 (;@22;) 7 (;@21;) 8 (;@20;) 9 (;@19;) 10 (;@18;) 11 (;@17;) 12 (;@16;) 13 (;@15;) 14 (;@14;) 15 (;@13;) 22 (;@6;) 16 (;@12;) 17 (;@11;) 18 (;@10;) 19 (;@9;) 20 (;@8;) 21 (;@7;) 0 (;@28;)
                                                          end
                                                          local.get 1
                                                          i32.const 0
                                                          call 58
                                                          br 22 (;@5;)
                                                        end
                                                        local.get 1
                                                        i32.const 1
                                                        call 58
                                                        br 21 (;@5;)
                                                      end
                                                      local.get 1
                                                      i32.const 2
                                                      call 58
                                                      br 20 (;@5;)
                                                    end
                                                    local.get 1
                                                    i32.const 3
                                                    call 58
                                                    br 19 (;@5;)
                                                  end
                                                  local.get 1
                                                  i32.const 4
                                                  call 58
                                                  br 18 (;@5;)
                                                end
                                                local.get 1
                                                i32.const 5
                                                call 58
                                                br 17 (;@5;)
                                              end
                                              i32.const 6
                                              local.set 3
                                              local.get 1
                                              i32.const 6
                                              call 58
                                              br 17 (;@4;)
                                            end
                                            local.get 1
                                            i32.const 7
                                            call 58
                                            br 15 (;@5;)
                                          end
                                          local.get 1
                                          i32.const 8
                                          call 58
                                          br 14 (;@5;)
                                        end
                                        local.get 1
                                        i32.const 9
                                        call 58
                                        br 13 (;@5;)
                                      end
                                      local.get 1
                                      i32.const 10
                                      call 58
                                      br 12 (;@5;)
                                    end
                                    local.get 1
                                    i32.const 11
                                    call 58
                                    br 11 (;@5;)
                                  end
                                  local.get 1
                                  i32.const 12
                                  call 58
                                  br 10 (;@5;)
                                end
                                local.get 1
                                i32.const 22
                                call 58
                                br 9 (;@5;)
                              end
                              i32.const 13
                              local.set 3
                            end
                            local.get 1
                            local.get 3
                            call 58
                            i32.const 4
                            local.set 3
                            br 10 (;@2;)
                          end
                          local.get 1
                          i32.const 16
                          call 58
                          local.get 0
                          i32.load offset=4
                          local.get 1
                          call 43
                          i32.const 255
                          i32.and
                          local.tee 3
                          i32.const 6
                          i32.ne
                          br_if 7 (;@4;)
                          br 8 (;@3;)
                        end
                        local.get 1
                        i32.const 17
                        call 58
                        local.get 0
                        i32.load offset=4
                        local.get 1
                        call 43
                        i32.const 255
                        i32.and
                        local.tee 3
                        i32.const 6
                        i32.eq
                        br_if 7 (;@3;)
                        br 6 (;@4;)
                      end
                      local.get 1
                      i32.const 18
                      call 58
                      local.get 0
                      i32.const 4
                      i32.add
                      local.set 4
                      i32.const 0
                      local.set 0
                      loop  ;; label = @10
                        local.get 0
                        i32.const 4
                        i32.eq
                        br_if 5 (;@5;)
                        local.get 4
                        local.get 0
                        i32.add
                        local.set 3
                        local.get 0
                        i32.const 4
                        i32.add
                        local.set 0
                        local.get 3
                        i32.load
                        local.get 1
                        call 43
                        i32.const 255
                        i32.and
                        local.tee 3
                        i32.const 6
                        i32.eq
                        br_if 0 (;@10;)
                        br 6 (;@4;)
                      end
                    end
                    local.get 1
                    i32.const 19
                    call 58
                    local.get 0
                    i32.const 4
                    i32.add
                    local.set 4
                    i32.const 0
                    local.set 0
                    loop  ;; label = @9
                      local.get 0
                      i32.const 8
                      i32.eq
                      br_if 4 (;@5;)
                      local.get 4
                      local.get 0
                      i32.add
                      local.set 3
                      local.get 0
                      i32.const 4
                      i32.add
                      local.set 0
                      local.get 3
                      i32.load
                      local.get 1
                      call 43
                      i32.const 255
                      i32.and
                      local.tee 3
                      i32.const 6
                      i32.eq
                      br_if 0 (;@9;)
                      br 5 (;@4;)
                    end
                  end
                  local.get 1
                  i32.const 20
                  call 58
                  i32.const 4
                  local.set 4
                  loop  ;; label = @8
                    local.get 4
                    i32.const 16
                    i32.eq
                    br_if 3 (;@5;)
                    local.get 0
                    local.get 4
                    i32.add
                    local.set 3
                    local.get 4
                    i32.const 4
                    i32.add
                    local.set 4
                    local.get 3
                    i32.load
                    local.get 1
                    call 43
                    i32.const 255
                    i32.and
                    local.tee 3
                    i32.const 6
                    i32.eq
                    br_if 0 (;@8;)
                    br 4 (;@4;)
                  end
                end
                local.get 1
                i32.const 21
                call 58
                br 1 (;@5;)
              end
              local.get 1
              i32.const 15
              call 58
              local.get 2
              i32.const 20
              i32.add
              local.get 0
              i32.load offset=4
              call 40
              local.get 2
              i32.load8_u offset=24
              local.set 3
              local.get 2
              i32.load offset=20
              local.tee 0
              i32.const -2147483648
              i32.eq
              br_if 1 (;@4;)
              local.get 2
              i32.const 8
              i32.add
              i32.const 8
              i32.add
              local.get 2
              i32.const 20
              i32.add
              i32.const 8
              i32.add
              i32.load align=1
              i32.store align=1
              local.get 2
              local.get 2
              i32.load offset=25 align=1
              i32.store offset=13 align=1
              local.get 2
              local.get 3
              i32.store8 offset=12
              local.get 2
              local.get 0
              i32.store offset=8
              local.get 1
              local.get 2
              i32.const 8
              i32.add
              call 41
              local.get 2
              i32.load offset=8
              local.get 2
              i32.load offset=12
              call 9
            end
            i32.const 6
            local.set 3
          end
          local.get 2
          i32.const 32
          i32.add
          global.set 0
          local.get 3
          return
        end
        i32.const 8
        local.set 3
      end
      local.get 0
      local.get 3
      i32.add
      i32.load
      local.set 0
      br 0 (;@1;)
    end)
  (func (;44;) (type 4) (param i32)
    (local i32)
    i32.const 4
    local.set 1
    block  ;; label = @1
      block  ;; label = @2
        block  ;; label = @3
          block  ;; label = @4
            block  ;; label = @5
              local.get 0
              i32.load
              i32.const -14
              i32.add
              br_table 1 (;@4;) 1 (;@4;) 4 (;@1;) 0 (;@5;) 0 (;@5;) 1 (;@4;) 2 (;@3;) 3 (;@2;) 4 (;@1;)
            end
            local.get 0
            i32.const 4
            i32.add
            call 59
            i32.const 8
            local.set 1
          end
          local.get 0
          local.get 1
          i32.add
          call 59
          br 2 (;@1;)
        end
        local.get 0
        i32.const 4
        i32.add
        local.set 0
        i32.const 0
        local.set 1
        loop  ;; label = @3
          local.get 1
          i32.const 8
          i32.eq
          br_if 2 (;@1;)
          local.get 0
          local.get 1
          i32.add
          call 59
          local.get 1
          i32.const 4
          i32.add
          local.set 1
          br 0 (;@3;)
        end
      end
      i32.const 4
      local.set 1
      loop  ;; label = @2
        local.get 1
        i32.const 16
        i32.eq
        br_if 1 (;@1;)
        local.get 0
        local.get 1
        i32.add
        call 59
        local.get 1
        i32.const 4
        i32.add
        local.set 1
        br 0 (;@2;)
      end
    end)
  (func (;45;) (type 4) (param i32)
    (local i32)
    global.get 0
    i32.const 16
    i32.sub
    local.tee 1
    global.set 0
    i32.const 1048743
    local.get 1
    i32.const 1049324
    call 52
    unreachable)
  (func (;46;) (type 9)
    i32.const 0
    i32.const 0
    call 49
    unreachable)
  (func (;47;) (type 0) (param i32 i32 i32 i32)
    (local i32)
    global.get 0
    i32.const 16
    i32.sub
    local.tee 4
    global.set 0
    block  ;; label = @1
      block  ;; label = @2
        local.get 0
        br_if 0 (;@2;)
        i32.const 0
        local.set 0
        local.get 4
        i32.const 12
        i32.add
        local.set 3
        br 1 (;@1;)
      end
      local.get 4
      local.get 2
      i32.store offset=12
      local.get 0
      local.get 3
      i32.mul
      local.set 0
      local.get 4
      i32.const 8
      i32.add
      local.set 3
    end
    local.get 3
    local.get 0
    i32.store
    block  ;; label = @1
      local.get 4
      i32.load offset=12
      local.tee 0
      i32.eqz
      br_if 0 (;@1;)
      local.get 4
      i32.load offset=8
      local.tee 3
      i32.eqz
      br_if 0 (;@1;)
      local.get 1
      local.get 0
      local.get 3
      call 14
    end
    local.get 4
    i32.const 16
    i32.add
    global.set 0)
  (func (;48;) (type 4) (param i32)
    local.get 0
    call 11
    unreachable)
  (func (;49;) (type 8) (param i32 i32)
    call 50
    unreachable)
  (func (;50;) (type 9)
    loop  ;; label = @1
      br 0 (;@1;)
    end)
  (func (;51;) (type 9)
    i32.const 1049352
    i32.const 35
    i32.const 1049372
    call 52
    unreachable)
  (func (;52;) (type 10) (param i32 i32 i32)
    loop  ;; label = @1
      br 0 (;@1;)
    end)
  (func (;53;) (type 0) (param i32 i32 i32 i32)
    (local i32)
    i32.const 0
    local.set 4
    block  ;; label = @1
      block  ;; label = @2
        local.get 3
        i32.const 0
        i32.ge_s
        br_if 0 (;@2;)
        i32.const 1
        local.set 1
        i32.const 4
        local.set 2
        br 1 (;@1;)
      end
      block  ;; label = @2
        block  ;; label = @3
          local.get 1
          i32.eqz
          br_if 0 (;@3;)
          local.get 2
          local.get 1
          i32.const 1
          local.get 3
          call 12
          local.set 4
          br 1 (;@2;)
        end
        i32.const 1
        local.get 3
        call 13
        local.set 4
      end
      block  ;; label = @2
        block  ;; label = @3
          local.get 4
          br_if 0 (;@3;)
          i32.const 1
          local.set 1
          local.get 0
          i32.const 1
          i32.store offset=4
          br 1 (;@2;)
        end
        local.get 0
        local.get 4
        i32.store offset=4
        i32.const 0
        local.set 1
      end
      i32.const 8
      local.set 2
      local.get 3
      local.set 4
    end
    local.get 0
    local.get 2
    i32.add
    local.get 4
    i32.store
    local.get 0
    local.get 1
    i32.store)
  (func (;54;) (type 4) (param i32)
    (local i32 i32 i32)
    global.get 0
    i32.const 16
    i32.sub
    local.tee 1
    global.set 0
    local.get 1
    i32.const 4
    i32.add
    local.get 0
    i32.load
    local.tee 2
    local.get 0
    i32.load offset=4
    local.get 2
    i32.const 1
    i32.shl
    local.tee 2
    i32.const 8
    local.get 2
    i32.const 8
    i32.gt_u
    select
    local.tee 2
    call 53
    block  ;; label = @1
      local.get 1
      i32.load offset=4
      i32.const 1
      i32.ne
      br_if 0 (;@1;)
      local.get 1
      i32.load offset=8
      local.get 1
      i32.load offset=12
      call 19
      unreachable
    end
    local.get 1
    i32.load offset=8
    local.set 3
    local.get 0
    local.get 2
    i32.store
    local.get 0
    local.get 3
    i32.store offset=4
    local.get 1
    i32.const 16
    i32.add
    global.set 0)
  (func (;55;) (type 2) (param i32) (result i32)
    local.get 0
    i32.const 255
    i32.and
    i32.const 2
    i32.shl
    i32.load offset=1049824)
  (func (;56;) (type 2) (param i32) (result i32)
    (local i32 i32)
    local.get 0
    i32.const 8
    i32.shr_u
    local.set 1
    i32.const 1
    local.set 2
    block  ;; label = @1
      block  ;; label = @2
        block  ;; label = @3
          block  ;; label = @4
            block  ;; label = @5
              block  ;; label = @6
                block  ;; label = @7
                  block  ;; label = @8
                    block  ;; label = @9
                      block  ;; label = @10
                        block  ;; label = @11
                          block  ;; label = @12
                            block  ;; label = @13
                              block  ;; label = @14
                                block  ;; label = @15
                                  block  ;; label = @16
                                    block  ;; label = @17
                                      block  ;; label = @18
                                        block  ;; label = @19
                                          block  ;; label = @20
                                            block  ;; label = @21
                                              block  ;; label = @22
                                                block  ;; label = @23
                                                  block  ;; label = @24
                                                    block  ;; label = @25
                                                      block  ;; label = @26
                                                        block  ;; label = @27
                                                          block  ;; label = @28
                                                            block  ;; label = @29
                                                              block  ;; label = @30
                                                                block  ;; label = @31
                                                                  block  ;; label = @32
                                                                    block  ;; label = @33
                                                                      block  ;; label = @34
                                                                        block  ;; label = @35
                                                                          block  ;; label = @36
                                                                            block  ;; label = @37
                                                                              block  ;; label = @38
                                                                                block  ;; label = @39
                                                                                  block  ;; label = @40
                                                                                    block  ;; label = @41
                                                                                      block  ;; label = @42
                                                                                        block  ;; label = @43
                                                                                          block  ;; label = @44
                                                                                            block  ;; label = @45
                                                                                              block  ;; label = @46
                                                                                                block  ;; label = @47
                                                                                                  block  ;; label = @48
                                                                                                    block  ;; label = @49
                                                                                                      block  ;; label = @50
                                                                                                        block  ;; label = @51
                                                                                                          block  ;; label = @52
                                                                                                            block  ;; label = @53
                                                                                                              block  ;; label = @54
                                                                                                                block  ;; label = @55
                                                                                                                  local.get 0
                                                                                                                  i32.const 255
                                                                                                                  i32.and
                                                                                                                  br_table 54 (;@1;) 0 (;@55;) 1 (;@54;) 2 (;@53;) 3 (;@52;) 4 (;@51;) 5 (;@50;) 6 (;@49;) 7 (;@48;) 8 (;@47;) 9 (;@46;) 10 (;@45;) 11 (;@44;) 12 (;@43;) 13 (;@42;) 14 (;@41;) 15 (;@40;) 16 (;@39;) 17 (;@38;) 18 (;@37;) 19 (;@36;) 20 (;@35;) 21 (;@34;) 22 (;@33;) 23 (;@32;) 24 (;@31;) 25 (;@30;) 26 (;@29;) 27 (;@28;) 28 (;@27;) 29 (;@26;) 30 (;@25;) 31 (;@24;) 32 (;@23;) 33 (;@22;) 34 (;@21;) 35 (;@20;) 36 (;@19;) 37 (;@18;) 38 (;@17;) 39 (;@16;) 40 (;@15;) 41 (;@14;) 42 (;@13;) 43 (;@12;) 44 (;@11;) 45 (;@10;) 46 (;@9;) 47 (;@8;) 48 (;@7;) 49 (;@6;) 50 (;@5;) 51 (;@4;) 52 (;@3;) 53 (;@2;) 54 (;@1;)
                                                                                                                end
                                                                                                                i32.const 2
                                                                                                                return
                                                                                                              end
                                                                                                              i32.const 3
                                                                                                              return
                                                                                                            end
                                                                                                            i32.const 4
                                                                                                            return
                                                                                                          end
                                                                                                          i32.const 5
                                                                                                          return
                                                                                                        end
                                                                                                        i32.const 6
                                                                                                        return
                                                                                                      end
                                                                                                      i32.const 7
                                                                                                      return
                                                                                                    end
                                                                                                    i32.const 8
                                                                                                    return
                                                                                                  end
                                                                                                  i32.const 9
                                                                                                  return
                                                                                                end
                                                                                                i32.const 10
                                                                                                return
                                                                                              end
                                                                                              i32.const 11
                                                                                              return
                                                                                            end
                                                                                            i32.const 12
                                                                                            return
                                                                                          end
                                                                                          i32.const 13
                                                                                          return
                                                                                        end
                                                                                        i32.const 14
                                                                                        return
                                                                                      end
                                                                                      i32.const 15
                                                                                      return
                                                                                    end
                                                                                    i32.const 16
                                                                                    return
                                                                                  end
                                                                                  i32.const 17
                                                                                  return
                                                                                end
                                                                                i32.const 18
                                                                                return
                                                                              end
                                                                              i32.const 19
                                                                              return
                                                                            end
                                                                            i32.const 20
                                                                            return
                                                                          end
                                                                          i32.const 21
                                                                          return
                                                                        end
                                                                        i32.const 22
                                                                        return
                                                                      end
                                                                      i32.const 23
                                                                      return
                                                                    end
                                                                    i32.const 24
                                                                    return
                                                                  end
                                                                  i32.const 25
                                                                  return
                                                                end
                                                                i32.const 26
                                                                return
                                                              end
                                                              i32.const 27
                                                              return
                                                            end
                                                            i32.const 28
                                                            return
                                                          end
                                                          i32.const 29
                                                          return
                                                        end
                                                        i32.const 30
                                                        return
                                                      end
                                                      i32.const 31
                                                      return
                                                    end
                                                    i32.const 32
                                                    return
                                                  end
                                                  i32.const 33
                                                  return
                                                end
                                                i32.const 34
                                                return
                                              end
                                              i32.const 35
                                              return
                                            end
                                            i32.const 36
                                            return
                                          end
                                          i32.const 37
                                          return
                                        end
                                        i32.const 38
                                        return
                                      end
                                      i32.const 39
                                      return
                                    end
                                    i32.const 40
                                    return
                                  end
                                  local.get 1
                                  i32.const 255
                                  i32.and
                                  i32.const 64512
                                  i32.or
                                  return
                                end
                                local.get 1
                                i32.const 255
                                i32.and
                                i32.const 64768
                                i32.or
                                return
                              end
                              local.get 1
                              i32.const 255
                              i32.and
                              i32.const 65024
                              i32.or
                              return
                            end
                            local.get 1
                            i32.const 255
                            i32.and
                            i32.const 65280
                            i32.or
                            return
                          end
                          local.get 0
                          i32.const 16
                          i32.shr_u
                          i32.const 65536
                          i32.or
                          return
                        end
                        i32.const 41
                        return
                      end
                      i32.const 42
                      return
                    end
                    i32.const 43
                    return
                  end
                  i32.const 44
                  return
                end
                i32.const 45
                return
              end
              i32.const 46
              return
            end
            i32.const 47
            return
          end
          i32.const 48
          return
        end
        i32.const 49
        return
      end
      i32.const 50
      local.set 2
    end
    local.get 2)
  (func (;57;) (type 0) (param i32 i32 i32 i32)
    block  ;; label = @1
      block  ;; label = @2
        local.get 0
        local.get 2
        i32.gt_u
        br_if 0 (;@2;)
        local.get 1
        local.get 2
        i32.gt_u
        br_if 1 (;@1;)
        local.get 1
        local.get 2
        local.get 3
        call 69
        unreachable
      end
      local.get 0
      local.get 2
      local.get 3
      call 70
      unreachable
    end
    local.get 1
    local.get 2
    local.get 3
    call 71
    unreachable)
  (func (;58;) (type 8) (param i32 i32)
    (local i32)
    block  ;; label = @1
      local.get 0
      i32.load offset=8
      local.tee 2
      local.get 0
      i32.load
      i32.ne
      br_if 0 (;@1;)
      local.get 0
      call 54
    end
    local.get 0
    local.get 2
    i32.const 1
    i32.add
    i32.store offset=8
    local.get 0
    i32.load offset=4
    local.get 2
    i32.add
    local.get 1
    i32.store8)
  (func (;59;) (type 4) (param i32)
    local.get 0
    i32.load
    local.tee 0
    call 44
    local.get 0
    i32.const 4
    i32.const 16
    call 14)
  (func (;60;) (type 11) (param i32 i32 i32 i32 i32)
    block  ;; label = @1
      local.get 2
      local.get 3
      i32.ge_u
      br_if 0 (;@1;)
      i32.const 1049452
      i32.const 19
      local.get 4
      call 52
      unreachable
    end
    local.get 0
    local.get 3
    i32.store offset=4
    local.get 0
    local.get 1
    i32.store
    local.get 0
    local.get 2
    local.get 3
    i32.sub
    i32.store offset=12
    local.get 0
    local.get 1
    local.get 3
    i32.add
    i32.store offset=8)
  (func (;61;) (type 8) (param i32 i32)
    (local i32 i32 i32 i32 i32)
    global.get 0
    i32.const 32
    i32.sub
    local.tee 2
    global.set 0
    block  ;; label = @1
      local.get 1
      local.get 0
      i32.load
      local.tee 3
      local.get 0
      i32.load offset=8
      local.tee 4
      i32.sub
      i32.le_u
      br_if 0 (;@1;)
      block  ;; label = @2
        block  ;; label = @3
          block  ;; label = @4
            local.get 1
            local.get 4
            i32.add
            local.tee 4
            local.get 1
            i32.ge_u
            br_if 0 (;@4;)
            i32.const 0
            local.set 0
            br 1 (;@3;)
          end
          i32.const 0
          local.set 5
          local.get 2
          i32.const 20
          i32.add
          local.set 6
          block  ;; label = @4
            local.get 4
            local.get 3
            i32.const 1
            i32.shl
            local.tee 1
            local.get 4
            local.get 1
            i32.gt_u
            select
            local.tee 1
            i32.const 8
            local.get 1
            i32.const 8
            i32.gt_u
            select
            local.tee 1
            i32.const 0
            i32.lt_s
            br_if 0 (;@4;)
            block  ;; label = @5
              block  ;; label = @6
                local.get 3
                br_if 0 (;@6;)
                i32.const 0
                local.set 3
                local.get 2
                i32.const 28
                i32.add
                local.set 4
                br 1 (;@5;)
              end
              local.get 0
              i32.load offset=4
              local.set 5
              local.get 2
              i32.const 1
              i32.store offset=28
              local.get 2
              i32.const 24
              i32.add
              local.set 4
            end
            local.get 4
            local.get 3
            i32.store
            block  ;; label = @5
              block  ;; label = @6
                local.get 2
                i32.load offset=28
                i32.eqz
                br_if 0 (;@6;)
                block  ;; label = @7
                  local.get 2
                  i32.load offset=24
                  local.tee 3
                  br_if 0 (;@7;)
                  local.get 2
                  i32.const 8
                  i32.add
                  local.get 1
                  call 74
                  local.get 2
                  i32.load offset=8
                  local.set 3
                  br 2 (;@5;)
                end
                local.get 5
                local.get 3
                i32.const 1
                local.get 1
                call 12
                local.set 3
                br 1 (;@5;)
              end
              local.get 2
              local.get 1
              call 74
              local.get 2
              i32.load
              local.set 3
            end
            local.get 3
            br_if 2 (;@2;)
            local.get 2
            i32.const 1
            i32.store offset=20
            local.get 2
            i32.const 16
            i32.add
            local.set 6
            local.get 1
            local.set 5
          end
          local.get 6
          local.get 5
          i32.store
          local.get 2
          i32.load offset=16
          local.set 1
          local.get 2
          i32.load offset=20
          local.set 0
        end
        local.get 0
        local.get 1
        call 19
        unreachable
      end
      local.get 0
      local.get 1
      i32.store
      local.get 0
      local.get 3
      i32.store offset=4
    end
    local.get 2
    i32.const 32
    i32.add
    global.set 0)
  (func (;62;) (type 10) (param i32 i32 i32)
    (local i32)
    local.get 0
    local.get 2
    call 61
    local.get 0
    i32.load offset=8
    local.set 3
    block  ;; label = @1
      local.get 2
      i32.eqz
      br_if 0 (;@1;)
      local.get 0
      i32.load offset=4
      local.get 3
      i32.add
      local.get 1
      local.get 2
      call $memcpy
    end
    local.get 0
    local.get 3
    local.get 2
    i32.add
    i32.store offset=8)
  (func (;63;) (type 8) (param i32 i32)
    (local i32 i32 i32 i32 i32)
    local.get 1
    i32.load offset=4
    i32.const -1
    i32.add
    local.set 2
    local.get 1
    i32.load
    local.set 3
    local.get 1
    i32.load8_u offset=8
    i32.const 1
    i32.and
    local.set 4
    block  ;; label = @1
      loop  ;; label = @2
        local.get 2
        i32.const 1
        i32.add
        local.tee 5
        local.get 3
        i32.eq
        br_if 1 (;@1;)
        local.get 1
        local.get 2
        i32.store offset=4
        local.get 2
        i32.load8_u
        local.set 6
        block  ;; label = @3
          local.get 4
          br_if 0 (;@3;)
          local.get 2
          i32.const -1
          i32.add
          local.set 2
          local.get 6
          i32.const 255
          i32.and
          i32.eqz
          br_if 1 (;@2;)
        end
      end
      local.get 1
      i32.const 1
      i32.store8 offset=8
    end
    local.get 0
    local.get 6
    i32.store8 offset=1
    local.get 0
    local.get 5
    local.get 3
    i32.ne
    i32.store8)
  (func (;64;) (type 10) (param i32 i32 i32)
    (local i32)
    global.get 0
    i32.const 16
    i32.sub
    local.tee 3
    global.set 0
    i32.const 1048576
    local.get 3
    local.get 2
    call 52
    unreachable)
  (func (;65;) (type 2) (param i32) (result i32)
    (local i32 i32)
    i32.const 0
    local.set 1
    block  ;; label = @1
      block  ;; label = @2
        block  ;; label = @3
          block  ;; label = @4
            block  ;; label = @5
              block  ;; label = @6
                block  ;; label = @7
                  block  ;; label = @8
                    local.get 0
                    i32.load
                    br_table 7 (;@1;) 7 (;@1;) 7 (;@1;) 7 (;@1;) 7 (;@1;) 7 (;@1;) 7 (;@1;) 7 (;@1;) 7 (;@1;) 7 (;@1;) 7 (;@1;) 7 (;@1;) 7 (;@1;) 7 (;@1;) 6 (;@2;) 6 (;@2;) 0 (;@8;) 1 (;@7;) 2 (;@6;) 3 (;@5;) 4 (;@4;) 5 (;@3;) 7 (;@1;) 7 (;@1;)
                  end
                  i32.const 4
                  local.set 1
                  br 6 (;@1;)
                end
                local.get 0
                i32.load offset=4
                call 65
                local.get 0
                i32.load offset=8
                call 65
                i32.add
                local.set 1
                br 5 (;@1;)
              end
              local.get 0
              i32.load offset=4
              call 65
              local.get 0
              i32.load offset=8
              call 65
              i32.add
              local.set 1
              br 4 (;@1;)
            end
            local.get 0
            i32.load offset=4
            call 65
            local.set 1
            br 3 (;@1;)
          end
          local.get 0
          i32.const 4
          i32.add
          local.set 0
          i32.const 0
          local.set 2
          i32.const 0
          local.set 1
          loop  ;; label = @4
            local.get 0
            local.get 2
            i32.add
            i32.load
            call 65
            local.get 1
            i32.add
            local.set 1
            local.get 2
            i32.const 4
            i32.add
            local.tee 2
            i32.const 8
            i32.ne
            br_if 0 (;@4;)
            br 3 (;@1;)
          end
        end
        i32.const 0
        local.set 1
        i32.const 4
        local.set 2
        loop  ;; label = @3
          local.get 0
          local.get 2
          i32.add
          i32.load
          call 65
          local.get 1
          i32.add
          local.set 1
          local.get 2
          i32.const 4
          i32.add
          local.tee 2
          i32.const 16
          i32.ne
          br_if 0 (;@3;)
          br 2 (;@1;)
        end
      end
      local.get 0
      i32.load offset=4
      call 65
      local.set 1
    end
    local.get 1
    i32.const 1
    i32.add)
  (func (;66;) (type 2) (param i32) (result i32)
    (local i32 i32)
    global.get 0
    i32.const 16
    i32.sub
    local.tee 1
    global.set 0
    block  ;; label = @1
      i32.const 4
      i32.const 16
      call 13
      local.tee 2
      br_if 0 (;@1;)
      call 46
      unreachable
    end
    local.get 1
    local.get 0
    i32.load
    call 42
    local.get 2
    i32.const 8
    i32.add
    local.get 1
    i32.const 8
    i32.add
    i64.load align=4
    i64.store align=4
    local.get 2
    local.get 1
    i64.load align=4
    i64.store align=4
    local.get 1
    i32.const 16
    i32.add
    global.set 0
    local.get 2)
  (func (;67;) (type 10) (param i32 i32 i32)
    loop  ;; label = @1
      block  ;; label = @2
        local.get 1
        br_if 0 (;@2;)
        return
      end
      local.get 0
      local.get 2
      call 66
      i32.store
      local.get 1
      i32.const -1
      i32.add
      local.set 1
      local.get 0
      i32.const 4
      i32.add
      local.set 0
      local.get 2
      i32.const 4
      i32.add
      local.set 2
      br 0 (;@1;)
    end)
  (func (;68;) (type 10) (param i32 i32 i32)
    block  ;; label = @1
      local.get 2
      i32.eqz
      br_if 0 (;@1;)
      local.get 1
      local.get 2
      call 13
      local.set 1
    end
    local.get 0
    local.get 2
    i32.store offset=4
    local.get 0
    local.get 1
    i32.store)
  (func (;69;) (type 10) (param i32 i32 i32)
    (local i32)
    global.get 0
    i32.const 16
    i32.sub
    local.tee 3
    global.set 0
    i32.const 1048688
    local.get 3
    local.get 2
    call 52
    unreachable)
  (func (;70;) (type 10) (param i32 i32 i32)
    (local i32)
    global.get 0
    i32.const 16
    i32.sub
    local.tee 3
    global.set 0
    i32.const 1048631
    local.get 3
    local.get 2
    call 52
    unreachable)
  (func (;71;) (type 10) (param i32 i32 i32)
    (local i32)
    global.get 0
    i32.const 16
    i32.sub
    local.tee 3
    global.set 0
    i32.const 1048688
    local.get 3
    local.get 2
    call 52
    unreachable)
  (func (;72;) (type 10) (param i32 i32 i32)
    local.get 1
    local.get 0
    local.get 2
    call 73
    unreachable)
  (func (;73;) (type 10) (param i32 i32 i32)
    (local i32)
    global.get 0
    i32.const 16
    i32.sub
    local.tee 3
    global.set 0
    i32.const 1049204
    local.get 3
    local.get 2
    call 52
    unreachable)
  (func (;74;) (type 8) (param i32 i32)
    (local i32)
    i32.const 1
    local.get 1
    call 13
    local.set 2
    local.get 0
    local.get 1
    i32.store offset=4
    local.get 0
    local.get 2
    i32.store)
  (func (;75;) (type 0) (param i32 i32 i32 i32)
    (local i32 i32 i32)
    global.get 0
    i32.const 16
    i32.sub
    local.tee 4
    global.set 0
    local.get 4
    local.get 1
    i32.load
    local.tee 5
    i32.load
    i32.store offset=12
    i32.const 1
    local.set 6
    local.get 2
    i32.const 2
    i32.add
    local.tee 1
    local.get 1
    i32.mul
    local.tee 1
    i32.const 2048
    local.get 1
    i32.const 2048
    i32.gt_u
    select
    local.tee 2
    i32.const 4
    local.get 4
    i32.const 12
    i32.add
    i32.const 1
    i32.const 1
    i32.const 2
    call 78
    local.set 1
    local.get 5
    local.get 4
    i32.load offset=12
    i32.store
    block  ;; label = @1
      local.get 1
      i32.eqz
      br_if 0 (;@1;)
      local.get 1
      i64.const 0
      i64.store offset=4 align=4
      local.get 1
      local.get 1
      local.get 2
      i32.const 2
      i32.shl
      i32.add
      i32.const 2
      i32.or
      i32.store
      i32.const 0
      local.set 6
    end
    local.get 0
    local.get 1
    i32.store offset=4
    local.get 0
    local.get 6
    i32.store
    local.get 4
    i32.const 16
    i32.add
    global.set 0)
  (func (;76;) (type 0) (param i32 i32 i32 i32)
    block  ;; label = @1
      block  ;; label = @2
        local.get 3
        i32.const 3
        i32.shl
        i32.const 16384
        i32.add
        local.tee 3
        local.get 2
        i32.const 2
        i32.shl
        local.tee 2
        local.get 3
        local.get 2
        i32.gt_u
        select
        i32.const 65543
        i32.add
        local.tee 3
        i32.const 16
        i32.shr_u
        memory.grow
        local.tee 2
        i32.const -1
        i32.ne
        br_if 0 (;@2;)
        i32.const 1
        local.set 3
        i32.const 0
        local.set 2
        br 1 (;@1;)
      end
      local.get 2
      i32.const 16
      i32.shl
      local.tee 2
      i64.const 0
      i64.store offset=4 align=4
      local.get 2
      local.get 2
      local.get 3
      i32.const -65536
      i32.and
      i32.add
      i32.const 2
      i32.or
      i32.store
      i32.const 0
      local.set 3
    end
    local.get 0
    local.get 2
    i32.store offset=4
    local.get 0
    local.get 3
    i32.store)
  (func (;77;) (type 1) (param i32 i32) (result i32)
    i32.const 512)
  (func (;78;) (type 12) (param i32 i32 i32 i32 i32 i32) (result i32)
    (local i32 i32)
    global.get 0
    i32.const 16
    i32.sub
    local.tee 6
    global.set 0
    block  ;; label = @1
      local.get 0
      local.get 1
      local.get 2
      local.get 3
      local.get 5
      call 79
      local.tee 7
      br_if 0 (;@1;)
      local.get 6
      i32.const 8
      i32.add
      local.get 3
      local.get 0
      local.get 1
      local.get 4
      call_indirect (type 0)
      i32.const 0
      local.set 7
      local.get 6
      i32.load offset=8
      i32.const 1
      i32.and
      br_if 0 (;@1;)
      local.get 6
      i32.load offset=12
      local.tee 7
      local.get 2
      i32.load
      i32.store offset=8
      local.get 2
      local.get 7
      i32.store
      local.get 0
      local.get 1
      local.get 2
      local.get 3
      local.get 5
      call 79
      local.set 7
    end
    local.get 6
    i32.const 16
    i32.add
    global.set 0
    local.get 7)
  (func (;79;) (type 13) (param i32 i32 i32 i32 i32) (result i32)
    (local i32 i32 i32 i32 i32 i32 i32)
    local.get 1
    i32.const -1
    i32.add
    local.set 5
    i32.const 0
    local.set 6
    i32.const 0
    local.get 1
    i32.sub
    local.set 7
    local.get 0
    i32.const 2
    i32.shl
    local.set 8
    local.get 2
    i32.load
    local.set 9
    block  ;; label = @1
      loop  ;; label = @2
        local.get 9
        i32.eqz
        br_if 1 (;@1;)
        local.get 9
        local.set 1
        loop  ;; label = @3
          block  ;; label = @4
            block  ;; label = @5
              block  ;; label = @6
                block  ;; label = @7
                  block  ;; label = @8
                    block  ;; label = @9
                      local.get 1
                      i32.load offset=8
                      local.tee 9
                      i32.const 1
                      i32.and
                      br_if 0 (;@9;)
                      local.get 1
                      i32.load
                      i32.const -4
                      i32.and
                      local.tee 10
                      local.get 1
                      i32.const 8
                      i32.add
                      local.tee 11
                      i32.sub
                      local.get 8
                      i32.lt_u
                      br_if 3 (;@6;)
                      block  ;; label = @10
                        local.get 11
                        local.get 3
                        local.get 0
                        local.get 4
                        call_indirect (type 1)
                        i32.const 2
                        i32.shl
                        i32.add
                        i32.const 8
                        i32.add
                        local.get 10
                        local.get 8
                        i32.sub
                        local.get 7
                        i32.and
                        local.tee 9
                        i32.le_u
                        br_if 0 (;@10;)
                        local.get 11
                        i32.load
                        local.set 9
                        local.get 5
                        local.get 11
                        i32.and
                        br_if 4 (;@6;)
                        local.get 2
                        local.get 9
                        i32.const -4
                        i32.and
                        i32.store
                        local.get 1
                        i32.load
                        local.set 2
                        local.get 1
                        local.set 9
                        br 3 (;@7;)
                      end
                      i32.const 0
                      local.set 2
                      local.get 9
                      i32.const 0
                      i32.store
                      local.get 9
                      i32.const -8
                      i32.add
                      local.tee 9
                      i64.const 0
                      i64.store align=4
                      local.get 9
                      local.get 1
                      i32.load
                      i32.const -4
                      i32.and
                      i32.store
                      block  ;; label = @10
                        local.get 1
                        i32.load
                        local.tee 11
                        i32.const 2
                        i32.and
                        br_if 0 (;@10;)
                        local.get 11
                        i32.const -4
                        i32.and
                        local.tee 11
                        i32.eqz
                        br_if 0 (;@10;)
                        local.get 11
                        local.get 11
                        i32.load offset=4
                        i32.const 3
                        i32.and
                        local.get 9
                        i32.or
                        i32.store offset=4
                        local.get 9
                        i32.load offset=4
                        i32.const 3
                        i32.and
                        local.set 2
                      end
                      local.get 9
                      local.get 2
                      local.get 1
                      i32.or
                      i32.store offset=4
                      local.get 1
                      local.get 1
                      i32.load offset=8
                      i32.const -2
                      i32.and
                      i32.store offset=8
                      local.get 1
                      local.get 1
                      i32.load
                      local.tee 2
                      i32.const 3
                      i32.and
                      local.get 9
                      i32.or
                      local.tee 11
                      i32.store
                      local.get 2
                      i32.const 2
                      i32.and
                      br_if 1 (;@8;)
                      local.get 9
                      i32.load
                      local.set 2
                      br 2 (;@7;)
                    end
                    local.get 1
                    local.get 9
                    i32.const -2
                    i32.and
                    i32.store offset=8
                    block  ;; label = @9
                      block  ;; label = @10
                        local.get 1
                        i32.load offset=4
                        i32.const -4
                        i32.and
                        local.tee 9
                        br_if 0 (;@10;)
                        i32.const 0
                        local.set 9
                        br 1 (;@9;)
                      end
                      i32.const 0
                      local.get 9
                      local.get 9
                      i32.load8_u
                      i32.const 1
                      i32.and
                      select
                      local.set 9
                    end
                    local.get 1
                    call 80
                    local.get 1
                    i32.load8_u
                    i32.const 2
                    i32.and
                    br_if 3 (;@5;)
                    br 4 (;@4;)
                  end
                  local.get 1
                  local.get 11
                  i32.const -3
                  i32.and
                  i32.store
                  local.get 9
                  i32.load
                  i32.const 2
                  i32.or
                  local.set 2
                end
                local.get 9
                local.get 2
                i32.const 1
                i32.or
                i32.store
                local.get 9
                i32.const 8
                i32.add
                local.set 6
                br 5 (;@1;)
              end
              local.get 2
              local.get 9
              i32.store
              br 3 (;@2;)
            end
            local.get 9
            local.get 9
            i32.load
            i32.const 2
            i32.or
            i32.store
          end
          local.get 2
          local.get 9
          i32.store
          local.get 9
          local.set 1
          br 0 (;@3;)
        end
      end
    end
    local.get 6)
  (func (;80;) (type 4) (param i32)
    (local i32 i32 i32)
    block  ;; label = @1
      local.get 0
      i32.load
      local.tee 1
      i32.const 2
      i32.and
      br_if 0 (;@1;)
      local.get 1
      i32.const -4
      i32.and
      local.tee 2
      i32.eqz
      br_if 0 (;@1;)
      local.get 2
      local.get 2
      i32.load offset=4
      i32.const 3
      i32.and
      local.get 0
      i32.load offset=4
      i32.const -4
      i32.and
      i32.or
      i32.store offset=4
      local.get 0
      i32.load
      local.set 1
    end
    block  ;; label = @1
      local.get 0
      i32.load offset=4
      local.tee 2
      i32.const -4
      i32.and
      local.tee 3
      i32.eqz
      br_if 0 (;@1;)
      local.get 3
      local.get 3
      i32.load
      i32.const 3
      i32.and
      local.get 1
      i32.const -4
      i32.and
      i32.or
      i32.store
      local.get 0
      i32.load offset=4
      local.set 2
      local.get 0
      i32.load
      local.set 1
    end
    local.get 0
    local.get 2
    i32.const 3
    i32.and
    i32.store offset=4
    local.get 0
    local.get 1
    i32.const 3
    i32.and
    i32.store)
  (func (;81;) (type 2) (param i32) (result i32)
    i32.const 1)
  (func (;82;) (type 1) (param i32 i32) (result i32)
    local.get 1)
  (func (;83;) (type 2) (param i32) (result i32)
    i32.const 0)
  (func (;84;) (type 0) (param i32 i32 i32 i32)
    (local i32)
    local.get 0
    i32.const 0
    i32.store
    local.get 0
    i32.const -8
    i32.add
    local.tee 4
    local.get 4
    i32.load
    i32.const -2
    i32.and
    i32.store
    block  ;; label = @1
      local.get 2
      local.get 3
      call_indirect (type 2)
      i32.eqz
      br_if 0 (;@1;)
      block  ;; label = @2
        block  ;; label = @3
          local.get 0
          i32.const -4
          i32.add
          i32.load
          i32.const -4
          i32.and
          local.tee 2
          i32.eqz
          br_if 0 (;@3;)
          local.get 2
          i32.load8_u
          i32.const 1
          i32.and
          br_if 0 (;@3;)
          local.get 4
          call 80
          local.get 4
          i32.load8_u
          i32.const 2
          i32.and
          i32.eqz
          br_if 1 (;@2;)
          local.get 2
          local.get 2
          i32.load
          i32.const 2
          i32.or
          i32.store
          return
        end
        local.get 4
        i32.load
        local.tee 2
        i32.const 2
        i32.and
        br_if 1 (;@1;)
        local.get 2
        i32.const -4
        i32.and
        local.tee 2
        i32.eqz
        br_if 1 (;@1;)
        local.get 2
        i32.load8_u
        i32.const 1
        i32.and
        br_if 1 (;@1;)
        local.get 0
        local.get 2
        i32.load offset=8
        i32.const -4
        i32.and
        i32.store
        local.get 2
        local.get 4
        i32.const 1
        i32.or
        i32.store offset=8
      end
      return
    end
    local.get 0
    local.get 1
    i32.load
    i32.store
    local.get 1
    local.get 4
    i32.store)
  (table (;0;) 7 7 funcref)
  (memory (;0;) 17)
  (global (;0;) (mut i32) (i32.const 1048576))
  (global (;1;) i32 (i32.const 1050876))
  (global (;2;) i32 (i32.const 1050880))
  (export "memory" (memory 0))
  (export "call" (func 20))
  (export "__data_end" (global 1))
  (export "__heap_base" (global 2))
  (elem (;0;) (i32.const 1) func 76 77 75 82 81 83)
  (data (;0;) (i32.const 1048576) " index out of bounds: the len is \c0\12 but the index is \c0\00\12range start index \c0\22 out of range for slice of length \c0\00\10range end index \c0\22 out of range for slice of length \c0\00\c0\02: \c0\00/Users/mertk/.cargo/registry/src/index.crates.io-1949cf8c6b5b557f/casper-types-6.0.1/src/uint.rs\00client_deposit.rs\00/Users/mertk/.cargo/registry/src/index.crates.io-1949cf8c6b5b557f/casper-types-6.0.1/src/bytesrepr.rs\00/Users/mertk/.rustup/toolchains/nightly-aarch64-apple-darwin/lib/rustlib/src/rust/library/core/src/slice/mod.rs\00library/alloc/src/raw_vec/mod.rs\00/Users/mertk/.cargo/registry/src/index.crates.io-1949cf8c6b5b557f/byteorder-1.5.0/src/lib.rs\00&copy_from_slice: source slice length (\c0+) does not match destination slice length (\c0\01)\00contract_hashamountl2_address\00\00\00\0e\01\10\00\11\00\00\002\00\00\00\09\00\00\00pursedepositcapacity overflow\00\00\00\f6\01\10\00 \00\00\00\1c\00\00\00\05\00\00\00\86\01\10\00o\00\00\00\f1\03\00\00\1c\00\00\00\86\01\10\00o\00\00\00\f2\03\00\00\1c\00\00\00\86\01\10\00o\00\00\00\f6\03\00\00 \00\00\00\86\01\10\00o\00\00\00\f6\03\00\00+\00\00\00mid > len\00\00\00\ad\00\10\00`\00\00\00*\00\00\00\05\00\00\00assertion failed: 8 * 8 >= slice.len()\00\00\17\02\10\00\5c\00\00\00\7f\08\00\00\0c\00\00\00\17\02\10\00\5c\00\00\00\7f\08\00\00\12\00\00\00 \01\10\00e\00\00\00\91\01\00\00\10\00\00\00\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\03\03\03\03\03\03\03\03\03\03\03\03\03\03\03\03\04\04\04\04\04\00\00\00\00\00\00\00\00\00\00\00\10\00\00\00\11\00\00\00\12\00\00\00\13\00\00\00'\00\00\00&\00\00\00")
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
)
