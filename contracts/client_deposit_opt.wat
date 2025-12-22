(module
  (type (;0;) (func (param i32 i32)))
  (type (;1;) (func (param i32)))
  (type (;2;) (func (param i32) (result i32)))
  (type (;3;) (func (param i32 i32 i32 i32)))
  (type (;4;) (func (param i32 i32 i32)))
  (type (;5;) (func (param i32 i32) (result i32)))
  (type (;6;) (func (param i32 i32 i32 i32) (result i32)))
  (type (;7;) (func (param i32 i32 i32) (result i32)))
  (type (;8;) (func))
  (type (;9;) (func (param i32 i32 i32 i32 i32 i32 i32 i32) (result i32)))
  (type (;10;) (func (param i32 i32 i32 i32 i32 i32 i32) (result i32)))
  (type (;11;) (func (param i32 i32 i32 i32 i32 i32) (result i32)))
  (type (;12;) (func (param i32 i32 i32 i32 i32) (result i32)))
  (import "env" "casper_get_named_arg" (func (;0;) (type 6)))
  (import "env" "casper_create_purse" (func (;1;) (type 5)))
  (import "env" "casper_get_main_purse" (func (;2;) (type 1)))
  (import "env" "casper_transfer_from_purse_to_purse" (func (;3;) (type 9)))
  (import "env" "casper_call_contract" (func (;4;) (type 10)))
  (import "env" "casper_read_host_buffer" (func (;5;) (type 7)))
  (import "env" "casper_revert" (func (;6;) (type 1)))
  (import "env" "casper_get_named_arg_size" (func (;7;) (type 7)))
  (func (;8;) (type 0) (param i32 i32)
    local.get 0
    local.get 1
    i32.const 1
    i32.const 1
    call 41)
  (func (;9;) (type 1) (param i32)
    (local i32 i32)
    block (result i32)  ;; label = @1
      local.get 0
      i32.const 8
      i32.shr_u
      local.set 1
      i32.const 1
      local.set 2
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
                                                                                                                  block  ;; label = @56
                                                                                                                    local.get 0
                                                                                                                    i32.const 255
                                                                                                                    i32.and
                                                                                                                    i32.const 1
                                                                                                                    i32.sub
                                                                                                                    br_table 0 (;@56;) 1 (;@55;) 2 (;@54;) 3 (;@53;) 4 (;@52;) 5 (;@51;) 6 (;@50;) 7 (;@49;) 8 (;@48;) 9 (;@47;) 10 (;@46;) 11 (;@45;) 12 (;@44;) 13 (;@43;) 14 (;@42;) 15 (;@41;) 16 (;@40;) 17 (;@39;) 18 (;@38;) 19 (;@37;) 20 (;@36;) 21 (;@35;) 22 (;@34;) 23 (;@33;) 24 (;@32;) 25 (;@31;) 26 (;@30;) 27 (;@29;) 28 (;@28;) 29 (;@27;) 30 (;@26;) 31 (;@25;) 32 (;@24;) 33 (;@23;) 34 (;@22;) 35 (;@21;) 36 (;@20;) 37 (;@19;) 38 (;@18;) 39 (;@17;) 40 (;@16;) 41 (;@15;) 42 (;@14;) 43 (;@13;) 44 (;@12;) 45 (;@11;) 46 (;@10;) 47 (;@9;) 48 (;@8;) 49 (;@7;) 50 (;@6;) 51 (;@5;) 52 (;@4;) 53 (;@3;) 54 (;@2;)
                                                                                                                  end
                                                                                                                  i32.const 2
                                                                                                                  br 54 (;@1;)
                                                                                                                end
                                                                                                                i32.const 3
                                                                                                                br 53 (;@1;)
                                                                                                              end
                                                                                                              i32.const 4
                                                                                                              br 52 (;@1;)
                                                                                                            end
                                                                                                            i32.const 5
                                                                                                            br 51 (;@1;)
                                                                                                          end
                                                                                                          i32.const 6
                                                                                                          br 50 (;@1;)
                                                                                                        end
                                                                                                        i32.const 7
                                                                                                        br 49 (;@1;)
                                                                                                      end
                                                                                                      i32.const 8
                                                                                                      br 48 (;@1;)
                                                                                                    end
                                                                                                    i32.const 9
                                                                                                    br 47 (;@1;)
                                                                                                  end
                                                                                                  i32.const 10
                                                                                                  br 46 (;@1;)
                                                                                                end
                                                                                                i32.const 11
                                                                                                br 45 (;@1;)
                                                                                              end
                                                                                              i32.const 12
                                                                                              br 44 (;@1;)
                                                                                            end
                                                                                            i32.const 13
                                                                                            br 43 (;@1;)
                                                                                          end
                                                                                          i32.const 14
                                                                                          br 42 (;@1;)
                                                                                        end
                                                                                        i32.const 15
                                                                                        br 41 (;@1;)
                                                                                      end
                                                                                      i32.const 16
                                                                                      br 40 (;@1;)
                                                                                    end
                                                                                    i32.const 17
                                                                                    br 39 (;@1;)
                                                                                  end
                                                                                  i32.const 18
                                                                                  br 38 (;@1;)
                                                                                end
                                                                                i32.const 19
                                                                                br 37 (;@1;)
                                                                              end
                                                                              i32.const 20
                                                                              br 36 (;@1;)
                                                                            end
                                                                            i32.const 21
                                                                            br 35 (;@1;)
                                                                          end
                                                                          i32.const 22
                                                                          br 34 (;@1;)
                                                                        end
                                                                        i32.const 23
                                                                        br 33 (;@1;)
                                                                      end
                                                                      i32.const 24
                                                                      br 32 (;@1;)
                                                                    end
                                                                    i32.const 25
                                                                    br 31 (;@1;)
                                                                  end
                                                                  i32.const 26
                                                                  br 30 (;@1;)
                                                                end
                                                                i32.const 27
                                                                br 29 (;@1;)
                                                              end
                                                              i32.const 28
                                                              br 28 (;@1;)
                                                            end
                                                            i32.const 29
                                                            br 27 (;@1;)
                                                          end
                                                          i32.const 30
                                                          br 26 (;@1;)
                                                        end
                                                        i32.const 31
                                                        br 25 (;@1;)
                                                      end
                                                      i32.const 32
                                                      br 24 (;@1;)
                                                    end
                                                    i32.const 33
                                                    br 23 (;@1;)
                                                  end
                                                  i32.const 34
                                                  br 22 (;@1;)
                                                end
                                                i32.const 35
                                                br 21 (;@1;)
                                              end
                                              i32.const 36
                                              br 20 (;@1;)
                                            end
                                            i32.const 37
                                            br 19 (;@1;)
                                          end
                                          i32.const 38
                                          br 18 (;@1;)
                                        end
                                        i32.const 39
                                        br 17 (;@1;)
                                      end
                                      i32.const 40
                                      br 16 (;@1;)
                                    end
                                    local.get 1
                                    i32.const 255
                                    i32.and
                                    i32.const 64512
                                    i32.or
                                    br 15 (;@1;)
                                  end
                                  local.get 1
                                  i32.const 255
                                  i32.and
                                  i32.const 64768
                                  i32.or
                                  br 14 (;@1;)
                                end
                                local.get 1
                                i32.const 255
                                i32.and
                                i32.const 65024
                                i32.or
                                br 13 (;@1;)
                              end
                              local.get 1
                              i32.const 255
                              i32.and
                              i32.const 65280
                              i32.or
                              br 12 (;@1;)
                            end
                            local.get 0
                            i32.const 16
                            i32.shr_u
                            i32.const 65536
                            i32.or
                            br 11 (;@1;)
                          end
                          i32.const 41
                          br 10 (;@1;)
                        end
                        i32.const 42
                        br 9 (;@1;)
                      end
                      i32.const 43
                      br 8 (;@1;)
                    end
                    i32.const 44
                    br 7 (;@1;)
                  end
                  i32.const 45
                  br 6 (;@1;)
                end
                i32.const 46
                br 5 (;@1;)
              end
              i32.const 47
              br 4 (;@1;)
            end
            i32.const 48
            br 3 (;@1;)
          end
          i32.const 49
          br 2 (;@1;)
        end
        i32.const 50
        local.set 2
      end
      local.get 2
    end
    call 6
    unreachable)
  (func (;10;) (type 6) (param i32 i32 i32 i32) (result i32)
    (local i32)
    local.get 2
    local.get 3
    call 11
    local.tee 4
    if  ;; label = @1
      local.get 3
      local.get 1
      local.get 1
      local.get 3
      i32.gt_u
      select
      local.tee 3
      if  ;; label = @2
        local.get 4
        local.get 0
        local.get 3
        memory.copy
      end
      local.get 0
      local.get 2
      local.get 1
      call 12
    end
    local.get 4)
  (func (;11;) (type 5) (param i32 i32) (result i32)
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
        local.get 0
        i32.const 4
        i32.le_u
        if  ;; label = @3
          local.get 1
          i32.const 1
          i32.sub
          local.tee 3
          i32.const 256
          i32.lt_u
          br_if 1 (;@2;)
        end
        local.get 2
        i32.const 1050872
        i32.load
        i32.store offset=8
        local.get 1
        local.get 0
        local.get 2
        i32.const 8
        i32.add
        i32.const 1049824
        i32.const 1
        i32.const 2
        call 59
        local.set 0
        i32.const 1050872
        local.get 2
        i32.load offset=8
        i32.store
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
      call 59
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
  (func (;12;) (type 4) (param i32 i32 i32)
    (local i32)
    global.get 0
    i32.const 16
    i32.sub
    local.tee 3
    global.set 0
    block  ;; label = @1
      block  ;; label = @2
        local.get 1
        i32.const 4
        i32.le_u
        if  ;; label = @3
          local.get 2
          i32.const 3
          i32.add
          i32.const 2
          i32.shr_u
          i32.const 1
          i32.sub
          local.tee 1
          i32.const 256
          i32.lt_u
          br_if 1 (;@2;)
        end
        local.get 3
        i32.const 1050872
        i32.load
        i32.store offset=8
        local.get 0
        local.get 3
        i32.const 8
        i32.add
        i32.const 1049824
        i32.const 5
        call 65
        i32.const 1050872
        local.get 3
        i32.load offset=8
        i32.store
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
      call 65
      local.get 1
      local.get 3
      i32.load offset=12
      i32.store offset=1049848
    end
    local.get 3
    i32.const 16
    i32.add
    global.set 0)
  (func (;13;) (type 0) (param i32 i32)
    (local i32 i32 i32 i32 i32 i32 i32)
    local.get 0
    i32.load offset=8
    local.tee 5
    local.get 0
    i32.load
    i32.eq
    if  ;; label = @1
      global.get 0
      i32.const 32
      i32.sub
      local.tee 2
      global.set 0
      block  ;; label = @2
        local.get 0
        i32.load
        local.tee 3
        i32.const 26843545
        i32.gt_u
        if (result i32)  ;; label = @3
          local.get 2
          i32.const 20
          i32.add
        else
          i32.const 4
          local.get 3
          i32.const 1
          i32.shl
          local.tee 4
          local.get 4
          i32.const 4
          i32.le_u
          select
          local.set 7
          block (result i32)  ;; label = @4
            local.get 3
            i32.eqz
            if  ;; label = @5
              local.get 2
              i32.const 28
              i32.add
              local.set 8
              i32.const 0
              br 1 (;@4;)
            end
            local.get 0
            i32.load offset=4
            local.set 6
            local.get 2
            i32.const 4
            i32.store offset=28
            local.get 2
            i32.const 24
            i32.add
            local.set 8
            local.get 3
            i32.const 40
            i32.mul
          end
          local.set 3
          local.get 7
          i32.const 40
          i32.mul
          local.set 4
          local.get 8
          local.get 3
          i32.store
          block (result i32)  ;; label = @4
            local.get 2
            i32.load offset=28
            if  ;; label = @5
              local.get 2
              i32.load offset=24
              local.tee 3
              i32.eqz
              if  ;; label = @6
                local.get 2
                i32.const 8
                i32.add
                i32.const 4
                local.get 4
                call 54
                local.get 2
                i32.load offset=8
                br 2 (;@4;)
              end
              local.get 6
              local.get 3
              i32.const 4
              local.get 4
              call 10
              br 1 (;@4;)
            end
            local.get 2
            i32.const 4
            local.get 4
            call 54
            local.get 2
            i32.load
          end
          local.tee 3
          br_if 1 (;@2;)
          local.get 2
          i32.const 4
          i32.store offset=20
          local.get 2
          i32.const 16
          i32.add
        end
        local.get 4
        i32.store
        local.get 2
        i32.load offset=16
        drop
        local.get 2
        i32.load offset=20
        call 16
        unreachable
      end
      local.get 0
      local.get 7
      i32.store
      local.get 0
      local.get 3
      i32.store offset=4
      local.get 2
      i32.const 32
      i32.add
      global.set 0
    end
    local.get 0
    i32.load offset=4
    local.get 5
    i32.const 40
    i32.mul
    i32.add
    local.get 1
    i32.const 40
    memory.copy
    local.get 0
    local.get 5
    i32.const 1
    i32.add
    i32.store offset=8)
  (func (;14;) (type 4) (param i32 i32 i32)
    (local i32 i32 i32 i32)
    global.get 0
    i32.const 16
    i32.sub
    local.tee 3
    global.set 0
    local.get 3
    i32.const 4
    i32.add
    local.get 2
    call 15
    local.get 3
    i32.load offset=8
    local.set 4
    local.get 3
    i32.load offset=4
    i32.const 1
    i32.ne
    if  ;; label = @1
      local.get 3
      i32.load offset=12
      local.set 5
      local.get 2
      if  ;; label = @2
        local.get 5
        local.get 1
        local.get 2
        memory.copy
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
    local.get 3
    i32.load offset=12
    local.set 6
    local.get 4
    call 16
    unreachable)
  (func (;15;) (type 0) (param i32 i32)
    (local i32 i32 i32)
    global.get 0
    i32.const 16
    i32.sub
    local.tee 2
    global.set 0
    block  ;; label = @1
      local.get 1
      i32.const 0
      i32.lt_s
      if  ;; label = @2
        local.get 0
        i32.const 0
        i32.store offset=4
        i32.const 1
        local.set 3
        br 1 (;@1;)
      end
      block  ;; label = @2
        local.get 1
        i32.eqz
        if  ;; label = @3
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
        call 54
        local.get 2
        i32.load offset=8
        local.tee 4
        i32.eqz
        if  ;; label = @3
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
  (func (;16;) (type 1) (param i32)
    local.get 0
    if  ;; label = @1
      loop  ;; label = @2
        br 0 (;@2;)
      end
      unreachable
    end
    loop  ;; label = @1
      br 0 (;@1;)
    end
    unreachable)
  (func (;17;) (type 8)
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
    call 18
    block  ;; label = @1
      block  ;; label = @2
        local.get 0
        i32.load offset=56
        i32.const 1
        i32.and
        i32.eqz
        br_if 0 (;@2;)
        local.get 0
        i32.const 424
        i32.add
        block (result i32)  ;; label = @3
          local.get 0
          i32.load offset=60
          local.tee 1
          i32.eqz
          if  ;; label = @4
            local.get 0
            i64.const 4294967296
            i64.store offset=232 align=4
            i32.const 1
            br 1 (;@3;)
          end
          block  ;; label = @4
            i32.const 1049292
            i32.const 13
            local.get 1
            call 19
            local.tee 2
            local.get 1
            call 0
            call 20
            local.tee 3
            i32.const 255
            i32.and
            i32.const 55
            i32.ne
            if  ;; label = @5
              local.get 0
              local.get 3
              i32.store8 offset=300
              local.get 0
              i32.const 303
              i32.add
              local.get 3
              i32.const 24
              i32.shr_u
              i32.store8
              local.get 0
              local.get 3
              i32.const 8
              i32.shr_u
              i32.store16 offset=301 align=1
              local.get 1
              local.get 2
              call 8
              i32.const -2147483648
              local.set 1
              br 1 (;@4;)
            end
            local.get 0
            local.get 1
            i32.store offset=304
            local.get 0
            local.get 2
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
          call 21
          local.get 0
          i32.load offset=240
          local.set 5
          local.get 0
          i32.load offset=236
        end
        local.tee 9
        local.get 5
        call 22
        local.get 0
        i32.load8_u offset=424
        local.set 2
        block (result i32)  ;; label = @3
          local.get 0
          i32.load offset=456
          i32.eqz
          if  ;; label = @4
            local.get 2
            local.set 6
            i32.const 1
            br 1 (;@3;)
          end
          local.get 0
          i32.const 383
          i32.add
          local.tee 4
          local.get 0
          i32.const 448
          i32.add
          i64.load align=1
          i64.store align=1
          local.get 0
          i32.const 376
          i32.add
          local.tee 1
          local.get 0
          i32.const 441
          i32.add
          i64.load align=1
          i64.store
          local.get 0
          i32.const 368
          i32.add
          local.tee 5
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
          local.set 6
          local.get 0
          i32.load offset=460
          local.tee 3
          i32.eqz
          if  ;; label = @4
            local.get 0
            i32.const 447
            i32.add
            local.get 4
            i64.load align=1
            i64.store align=1
            local.get 0
            i32.const 440
            i32.add
            local.get 1
            i64.load
            i64.store
            local.get 0
            i32.const 432
            i32.add
            local.get 5
            i64.load
            i64.store
            local.get 0
            local.get 0
            i64.load offset=360
            i64.store offset=424
            local.get 2
            local.set 6
          end
          local.get 3
          i32.const 0
          i32.ne
        end
        local.set 3
        local.get 0
        i32.load offset=232
        local.get 9
        call 8
        block (result i32)  ;; label = @3
          block  ;; label = @4
            block  ;; label = @5
              local.get 3
              i32.eqz
              if  ;; label = @6
                local.get 0
                i32.const 87
                i32.add
                local.get 0
                i32.const 447
                i32.add
                i64.load align=1
                i64.store align=1
                local.get 0
                i32.const 80
                i32.add
                local.get 0
                i32.const 440
                i32.add
                i64.load
                i64.store
                local.get 0
                i32.const 72
                i32.add
                local.get 0
                i32.const 432
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
                call 18
                local.get 0
                i32.load offset=48
                i32.const 1
                i32.and
                i32.eqz
                br_if 4 (;@2;)
                local.get 0
                i32.load offset=52
                local.tee 1
                i32.eqz
                if  ;; label = @7
                  local.get 0
                  i32.const 0
                  i32.store offset=512
                  local.get 0
                  i64.const 4294967296
                  i64.store offset=504 align=4
                  i32.const 1
                  local.set 5
                  br 3 (;@4;)
                end
                block  ;; label = @7
                  i32.const 1049305
                  i32.const 6
                  local.get 1
                  call 19
                  local.tee 2
                  local.get 1
                  call 0
                  call 20
                  local.tee 3
                  i32.const 255
                  i32.and
                  i32.const 55
                  i32.ne
                  if  ;; label = @8
                    local.get 0
                    local.get 3
                    i32.store8 offset=528
                    local.get 0
                    i32.const 531
                    i32.add
                    local.get 3
                    i32.const 24
                    i32.shr_u
                    i32.store8
                    local.get 0
                    local.get 3
                    i32.const 8
                    i32.shr_u
                    i32.store16 offset=529 align=1
                    local.get 1
                    local.get 2
                    call 8
                    i32.const -2147483648
                    local.set 1
                    br 1 (;@7;)
                  end
                  local.get 0
                  local.get 1
                  i32.store offset=532
                  local.get 0
                  local.get 2
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
                call 21
                local.get 0
                i32.load offset=508
                local.set 5
                local.get 0
                i32.load offset=512
                local.tee 3
                i32.eqz
                br_if 2 (;@4;)
                local.get 5
                i32.load8_u
                local.tee 2
                i32.const 64
                i32.gt_u
                br_if 2 (;@4;)
                local.get 0
                i32.const 424
                i32.add
                local.tee 4
                local.get 5
                i32.const 1
                i32.add
                local.get 3
                i32.const 1
                i32.sub
                local.get 2
                call 23
                local.get 0
                i32.load offset=424
                local.tee 3
                i32.eqz
                br_if 2 (;@4;)
                local.get 0
                i32.load offset=428
                local.tee 8
                i32.const 65
                i32.ge_u
                br_if 1 (;@5;)
                local.get 0
                i32.load offset=436
                local.set 9
                i32.const 0
                local.set 1
                local.get 0
                i32.const 360
                i32.add
                local.tee 2
                i32.const 0
                i32.const 64
                memory.fill
                local.get 0
                i32.const 40
                i32.add
                local.get 8
                local.get 2
                i32.const 64
                call 24
                local.get 0
                i32.load offset=40
                local.get 0
                i32.load offset=44
                local.get 3
                local.get 8
                call 25
                local.get 4
                i32.const 0
                i32.const 64
                memory.fill
                loop  ;; label = @7
                  local.get 1
                  i32.const 64
                  i32.ne
                  if  ;; label = @8
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
                    br 1 (;@7;)
                  end
                end
                local.get 0
                i32.load8_u offset=424
                local.set 2
                local.get 0
                i32.const 296
                i32.add
                local.tee 3
                local.get 0
                i32.const 424
                i32.add
                local.tee 1
                i32.const 1
                i32.or
                i32.const 63
                memory.copy
                local.get 1
                local.get 3
                i32.const 63
                memory.copy
                local.get 9
                i32.eqz
                if  ;; label = @7
                  local.get 0
                  i32.const 232
                  i32.add
                  local.get 1
                  i32.const 63
                  memory.copy
                end
                local.get 9
                i32.const 0
                i32.ne
                br 3 (;@3;)
              end
              i32.const 2
              call 9
              unreachable
            end
            loop  ;; label = @5
              br 0 (;@5;)
            end
            unreachable
          end
          i32.const 1
        end
        local.get 0
        i32.load offset=504
        local.get 5
        call 8
        i32.eqz
        if  ;; label = @3
          local.get 0
          local.get 2
          i32.store8 offset=96
          local.get 0
          i32.const 96
          i32.add
          i32.const 1
          i32.or
          local.get 0
          i32.const 232
          i32.add
          i32.const 63
          memory.copy
          local.get 0
          i32.const 32
          i32.add
          i32.const 1049311
          i32.const 10
          call 18
          local.get 0
          i32.load offset=32
          i32.const 1
          i32.and
          i32.eqz
          br_if 1 (;@2;)
          block (result i32)  ;; label = @4
            local.get 0
            i32.load offset=36
            local.tee 1
            i32.eqz
            if  ;; label = @5
              local.get 0
              i32.const 0
              i32.store offset=304
              local.get 0
              i64.const 4294967296
              i64.store offset=296 align=4
              i32.const 1
              local.set 13
              i32.const 0
              br 1 (;@4;)
            end
            block  ;; label = @5
              i32.const 1049311
              i32.const 10
              local.get 1
              call 19
              local.tee 2
              local.get 1
              call 0
              call 20
              local.tee 3
              i32.const 255
              i32.and
              i32.const 55
              i32.ne
              if  ;; label = @6
                local.get 0
                local.get 3
                i32.store8 offset=364
                local.get 0
                i32.const 367
                i32.add
                local.get 3
                i32.const 24
                i32.shr_u
                i32.store8
                local.get 0
                local.get 3
                i32.const 8
                i32.shr_u
                i32.store16 offset=365 align=1
                local.get 1
                local.get 2
                call 8
                i32.const -2147483648
                local.set 1
                br 1 (;@5;)
              end
              local.get 0
              local.get 1
              i32.store offset=368
              local.get 0
              local.get 2
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
            call 21
            local.get 0
            i32.load offset=300
            local.set 13
            local.get 0
            i32.load offset=304
          end
          local.set 3
          local.get 0
          i32.const 0
          i32.store offset=232
          local.get 0
          i32.const 424
          i32.add
          local.get 13
          local.get 3
          i32.const 4
          call 23
          local.get 0
          i32.load offset=424
          local.tee 5
          i32.eqz
          if  ;; label = @4
            local.get 0
            i32.load8_u offset=428
            local.set 5
            i32.const -2147483648
            local.set 4
            br 3 (;@1;)
          end
          local.get 0
          i32.load offset=436
          local.set 3
          local.get 0
          i32.load offset=432
          local.set 2
          local.get 0
          i32.const 232
          i32.add
          i32.const 4
          local.get 5
          local.get 0
          i32.load offset=428
          call 25
          local.get 0
          i32.const 424
          i32.add
          local.get 2
          local.get 3
          local.get 0
          i32.load offset=232
          call 23
          local.get 0
          i32.load offset=424
          local.tee 1
          i32.eqz
          if  ;; label = @4
            local.get 0
            i32.load8_u offset=428
            local.set 5
            i32.const -2147483648
            local.set 4
            br 3 (;@1;)
          end
          local.get 0
          i32.load offset=436
          local.get 0
          i32.const 24
          i32.add
          local.get 0
          i32.load offset=428
          local.tee 2
          call 26
          local.get 0
          i32.load offset=24
          local.set 3
          local.get 0
          i32.load offset=28
          local.set 5
          local.get 2
          if  ;; label = @4
            local.get 5
            local.get 1
            local.get 2
            memory.copy
          end
          block  ;; label = @4
            local.get 2
            i32.eqz
            br_if 0 (;@4;)
            local.get 2
            i32.const 7
            i32.sub
            local.tee 1
            i32.const 0
            local.get 1
            local.get 2
            i32.le_u
            select
            local.set 11
            local.get 5
            i32.const 3
            i32.add
            i32.const -4
            i32.and
            local.get 5
            i32.sub
            local.set 9
            i32.const 0
            local.set 1
            loop  ;; label = @5
              block  ;; label = @6
                block  ;; label = @7
                  block  ;; label = @8
                    local.get 1
                    local.get 5
                    i32.add
                    i32.load8_u
                    local.tee 12
                    i32.extend8_s
                    local.tee 14
                    i32.const 0
                    i32.ge_s
                    if  ;; label = @9
                      local.get 9
                      local.get 1
                      i32.sub
                      i32.const 3
                      i32.and
                      br_if 1 (;@8;)
                      local.get 1
                      local.get 11
                      i32.ge_u
                      br_if 2 (;@7;)
                      loop  ;; label = @10
                        local.get 1
                        local.get 5
                        i32.add
                        local.tee 4
                        i32.const 4
                        i32.add
                        i32.load
                        local.get 4
                        i32.load
                        i32.or
                        i32.const -2139062144
                        i32.and
                        br_if 3 (;@7;)
                        local.get 1
                        i32.const 8
                        i32.add
                        local.tee 1
                        local.get 11
                        i32.lt_u
                        br_if 0 (;@10;)
                      end
                      br 2 (;@7;)
                    end
                    block  ;; label = @9
                      block  ;; label = @10
                        block  ;; label = @11
                          block  ;; label = @12
                            block  ;; label = @13
                              block  ;; label = @14
                                block  ;; label = @15
                                  local.get 12
                                  i32.load8_u offset=1049568
                                  i32.const 2
                                  i32.sub
                                  br_table 0 (;@15;) 1 (;@14;) 2 (;@13;) 5 (;@10;)
                                end
                                local.get 1
                                i32.const 1
                                i32.add
                                local.tee 4
                                local.get 2
                                i32.ge_u
                                br_if 4 (;@10;)
                                local.get 4
                                local.get 5
                                i32.add
                                i32.load8_s
                                i32.const -65
                                i32.gt_s
                                br_if 4 (;@10;)
                                br 5 (;@9;)
                              end
                              local.get 1
                              i32.const 1
                              i32.add
                              local.tee 4
                              local.get 2
                              i32.ge_u
                              br_if 3 (;@10;)
                              local.get 4
                              local.get 5
                              i32.add
                              i32.load8_s
                              local.set 4
                              block  ;; label = @14
                                local.get 12
                                i32.const 224
                                i32.ne
                                if  ;; label = @15
                                  local.get 12
                                  i32.const 237
                                  i32.eq
                                  br_if 1 (;@14;)
                                  local.get 14
                                  i32.const 31
                                  i32.add
                                  i32.const 255
                                  i32.and
                                  i32.const 12
                                  i32.lt_u
                                  br_if 3 (;@12;)
                                  local.get 14
                                  i32.const -2
                                  i32.and
                                  i32.const -18
                                  i32.ne
                                  br_if 5 (;@10;)
                                  local.get 4
                                  i32.const -64
                                  i32.lt_s
                                  br_if 4 (;@11;)
                                  br 5 (;@10;)
                                end
                                local.get 4
                                i32.const -32
                                i32.and
                                i32.const -96
                                i32.eq
                                br_if 3 (;@11;)
                                br 4 (;@10;)
                              end
                              local.get 4
                              i32.const -97
                              i32.gt_s
                              br_if 3 (;@10;)
                              br 2 (;@11;)
                            end
                            local.get 1
                            i32.const 1
                            i32.add
                            local.tee 4
                            local.get 2
                            i32.ge_u
                            br_if 2 (;@10;)
                            local.get 4
                            local.get 5
                            i32.add
                            i32.load8_s
                            local.set 4
                            block  ;; label = @13
                              block  ;; label = @14
                                block  ;; label = @15
                                  block  ;; label = @16
                                    local.get 12
                                    i32.const 240
                                    i32.sub
                                    br_table 1 (;@15;) 0 (;@16;) 0 (;@16;) 0 (;@16;) 2 (;@14;) 0 (;@16;)
                                  end
                                  local.get 14
                                  i32.const 15
                                  i32.add
                                  i32.const 255
                                  i32.and
                                  i32.const 2
                                  i32.gt_u
                                  br_if 5 (;@10;)
                                  local.get 4
                                  i32.const -64
                                  i32.lt_s
                                  br_if 2 (;@13;)
                                  br 5 (;@10;)
                                end
                                local.get 4
                                i32.const 112
                                i32.add
                                i32.const 255
                                i32.and
                                i32.const 48
                                i32.lt_u
                                br_if 1 (;@13;)
                                br 4 (;@10;)
                              end
                              local.get 4
                              i32.const -113
                              i32.gt_s
                              br_if 3 (;@10;)
                            end
                            local.get 1
                            i32.const 2
                            i32.add
                            local.tee 4
                            local.get 2
                            i32.ge_u
                            br_if 2 (;@10;)
                            local.get 4
                            local.get 5
                            i32.add
                            i32.load8_s
                            i32.const -65
                            i32.gt_s
                            br_if 2 (;@10;)
                            local.get 1
                            i32.const 3
                            i32.add
                            local.tee 4
                            local.get 2
                            i32.ge_u
                            br_if 2 (;@10;)
                            local.get 4
                            local.get 5
                            i32.add
                            i32.load8_s
                            i32.const -64
                            i32.lt_s
                            br_if 3 (;@9;)
                            br 2 (;@10;)
                          end
                          local.get 4
                          i32.const -64
                          i32.ge_s
                          br_if 1 (;@10;)
                        end
                        local.get 1
                        i32.const 2
                        i32.add
                        local.tee 4
                        local.get 2
                        i32.ge_u
                        br_if 0 (;@10;)
                        local.get 4
                        local.get 5
                        i32.add
                        i32.load8_s
                        i32.const -65
                        i32.le_s
                        br_if 1 (;@9;)
                      end
                      i32.const -2147483648
                      local.set 4
                      local.get 3
                      i32.const -2147483648
                      i32.eq
                      if  ;; label = @10
                        local.get 5
                        local.set 3
                        local.get 2
                        local.set 5
                        local.get 1
                        local.set 2
                        br 6 (;@4;)
                      end
                      local.get 3
                      local.get 5
                      call 8
                      i32.const 1
                      local.set 5
                      br 8 (;@1;)
                    end
                    local.get 4
                    i32.const 1
                    i32.add
                    local.set 1
                    br 2 (;@6;)
                  end
                  local.get 1
                  i32.const 1
                  i32.add
                  local.set 1
                  br 1 (;@6;)
                end
                local.get 1
                local.get 2
                i32.ge_u
                br_if 0 (;@6;)
                loop  ;; label = @7
                  local.get 1
                  local.get 5
                  i32.add
                  i32.load8_s
                  i32.const 0
                  i32.lt_s
                  br_if 1 (;@6;)
                  local.get 2
                  local.get 1
                  i32.const 1
                  i32.add
                  local.tee 1
                  i32.ne
                  br_if 0 (;@7;)
                end
                br 2 (;@4;)
              end
              local.get 1
              local.get 2
              i32.lt_u
              br_if 0 (;@5;)
            end
          end
          i32.const -2147483648
          local.set 4
          local.get 3
          i32.const -2147483648
          i32.eq
          br_if 2 (;@1;)
          i32.eqz
          if  ;; label = @4
            local.get 5
            i32.const -256
            i32.and
            local.set 15
            local.get 3
            local.set 4
            br 3 (;@1;)
          end
          local.get 3
          local.get 5
          call 8
          i32.const 2
          local.set 5
          br 2 (;@1;)
        end
        i32.const 2
        call 9
        unreachable
      end
      i32.const 1
      call 9
      unreachable
    end
    local.get 0
    i32.load offset=296
    local.get 13
    call 8
    block  ;; label = @1
      block  ;; label = @2
        block  ;; label = @3
          local.get 4
          i32.const -2147483648
          i32.ne
          if  ;; label = @4
            i32.const 33
            call 19
            local.tee 3
            i32.const 33
            call 1
            call 20
            call 27
            local.get 0
            i32.const 33
            i32.store offset=368
            local.get 0
            local.get 3
            i32.store offset=364
            local.get 0
            i32.const 33
            i32.store offset=360
            local.get 0
            i32.const 424
            i32.add
            local.tee 7
            local.get 0
            i32.const 360
            i32.add
            local.tee 10
            call 28
            local.get 0
            i32.const 166
            i32.add
            local.tee 16
            local.get 7
            call 29
            i32.const 33
            call 19
            local.tee 3
            call 2
            local.get 0
            i32.const 33
            i32.store offset=368
            local.get 0
            local.get 3
            i32.store offset=364
            local.get 0
            i32.const 33
            i32.store offset=360
            local.get 7
            local.get 10
            call 28
            local.get 0
            i32.const 199
            i32.add
            local.tee 3
            local.get 7
            call 29
            local.get 7
            local.get 3
            call 30
            local.get 0
            i32.load offset=436
            local.set 18
            local.get 0
            i32.load offset=432
            local.set 19
            local.get 0
            i32.load offset=428
            local.set 20
            local.get 0
            i32.load offset=424
            local.set 21
            local.get 7
            local.get 16
            call 30
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
            local.set 1
            local.get 7
            local.get 0
            i32.const 96
            i32.add
            local.tee 11
            call 31
            local.get 10
            local.get 7
            call 32
            local.get 0
            i32.load offset=364
            local.set 17
            local.get 0
            i32.load offset=368
            local.set 3
            local.get 0
            i32.load offset=360
            local.set 8
            i32.const 1
            i32.const 1
            call 11
            local.tee 9
            if  ;; label = @5
              local.get 9
              i32.const 0
              i32.store8
              local.get 0
              i32.const 1
              i32.store offset=432
              local.get 0
              local.get 9
              i32.store offset=428
              local.get 0
              i32.const 1
              i32.store offset=424
              local.get 10
              local.get 7
              call 32
              local.get 0
              i32.load offset=360
              local.get 21
              local.get 20
              local.get 1
              local.get 14
              local.get 17
              local.get 3
              local.get 0
              i32.load offset=364
              local.tee 1
              local.get 0
              i32.load offset=368
              call 3
              call 20
              local.set 3
              local.get 1
              call 8
              local.get 8
              local.get 17
              call 8
              local.get 13
              local.get 12
              call 8
              local.get 19
              local.get 18
              call 8
              local.get 3
              call 27
              local.get 0
              i32.const 0
              i32.store offset=368
              local.get 0
              i64.const 17179869184
              i64.store offset=360 align=4
              local.get 7
              local.get 11
              call 31
              local.get 0
              i32.load offset=424
              local.tee 1
              i32.const -2147483648
              i32.ne
              if  ;; label = @6
                local.get 0
                local.get 0
                i32.load offset=429 align=1
                i32.store offset=296
                local.get 0
                local.get 0
                i32.const 432
                i32.add
                local.tee 11
                i32.load align=1
                i32.store offset=299 align=1
                local.get 0
                i32.load8_u offset=428
                local.set 3
                local.get 0
                i32.const 452
                i32.add
                local.tee 8
                i32.const 1049305
                i32.const 6
                call 14
                local.get 0
                i32.const 448
                i32.add
                local.tee 9
                local.get 0
                i32.load offset=299 align=1
                i32.store align=1
                local.get 0
                local.get 3
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
                local.get 10
                local.get 7
                call 13
                local.get 7
                local.get 16
                call 33
                local.get 0
                i32.load offset=424
                local.tee 1
                i32.const -2147483648
                i32.ne
                if  ;; label = @7
                  local.get 0
                  local.get 0
                  i32.load offset=429 align=1
                  i32.store offset=296
                  local.get 0
                  local.get 11
                  i32.load align=1
                  i32.store offset=299 align=1
                  local.get 0
                  i32.load8_u offset=428
                  local.set 3
                  local.get 8
                  i32.const 1049340
                  i32.const 5
                  call 14
                  local.get 9
                  local.get 0
                  i32.load offset=299 align=1
                  i32.store align=1
                  local.get 0
                  local.get 3
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
                  local.get 10
                  local.get 7
                  call 13
                  local.get 7
                  local.get 15
                  local.get 5
                  i32.const 255
                  i32.and
                  i32.or
                  local.tee 3
                  local.get 2
                  call 34
                  local.get 4
                  local.get 3
                  call 8
                  local.get 0
                  i32.load offset=424
                  local.tee 3
                  i32.const -2147483648
                  i32.ne
                  if  ;; label = @8
                    local.get 0
                    local.get 0
                    i32.load offset=429 align=1
                    i32.store offset=296
                    local.get 0
                    local.get 11
                    i32.load align=1
                    i32.store offset=299 align=1
                    local.get 0
                    i32.load8_u offset=428
                    local.set 2
                    local.get 8
                    i32.const 1049311
                    i32.const 10
                    call 14
                    local.get 9
                    local.get 0
                    i32.load offset=299 align=1
                    i32.store align=1
                    local.get 0
                    local.get 2
                    i32.store8 offset=444
                    local.get 0
                    local.get 3
                    i32.store offset=440
                    local.get 0
                    i32.const 10
                    i32.store offset=424
                    local.get 0
                    local.get 0
                    i32.load offset=296
                    i32.store offset=445 align=1
                    local.get 10
                    local.get 7
                    call 13
                    local.get 0
                    i32.load offset=360
                    local.set 20
                    local.get 0
                    i32.load offset=364
                    local.set 3
                    local.get 0
                    i32.load offset=368
                    local.set 5
                    local.get 7
                    i32.const 32
                    call 15
                    local.get 0
                    i32.load offset=428
                    local.set 2
                    local.get 0
                    i32.load offset=424
                    i32.const 1
                    i32.ne
                    if  ;; label = @9
                      local.get 0
                      i32.load offset=432
                      local.tee 1
                      local.get 6
                      i32.store8
                      local.get 1
                      local.get 0
                      i64.load offset=64
                      i64.store offset=1 align=1
                      local.get 1
                      i32.const 9
                      i32.add
                      local.get 0
                      i32.const 72
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
                      local.get 2
                      i32.store offset=424
                      local.get 0
                      i32.const 32
                      i32.store offset=432
                      local.get 10
                      local.get 7
                      call 32
                      local.get 0
                      i32.load offset=364
                      local.set 23
                      local.get 0
                      i32.load offset=368
                      local.set 21
                      local.get 0
                      i32.load offset=360
                      local.set 12
                      local.get 7
                      i32.const 1049345
                      i32.const 7
                      call 34
                      local.get 10
                      local.get 7
                      call 32
                      local.get 0
                      i32.load offset=364
                      local.set 10
                      local.get 0
                      i32.load offset=368
                      local.set 13
                      local.get 0
                      i32.load offset=360
                      local.set 14
                      local.get 0
                      i32.const 16
                      i32.add
                      local.get 5
                      if (result i32)  ;; label = @10
                        i32.const 0
                        local.set 2
                        local.get 3
                        local.set 1
                        local.get 5
                        local.set 4
                        loop  ;; label = @11
                          local.get 1
                          call 35
                          local.get 2
                          i32.add
                          local.set 2
                          local.get 1
                          i32.const 40
                          i32.add
                          local.set 1
                          local.get 4
                          i32.const 1
                          i32.sub
                          local.tee 4
                          br_if 0 (;@11;)
                        end
                        local.get 2
                        i32.const 4
                        i32.add
                      else
                        i32.const 4
                      end
                      call 26
                      local.get 0
                      i32.const 0
                      i32.store offset=500
                      local.get 0
                      local.get 0
                      i32.load offset=20
                      local.tee 2
                      i32.store offset=496
                      local.get 0
                      local.get 0
                      i32.load offset=16
                      local.tee 4
                      i32.store offset=492
                      local.get 0
                      i32.const 424
                      i32.add
                      local.get 5
                      call 36
                      local.get 0
                      i32.load8_u offset=428
                      local.set 6
                      local.get 0
                      i32.load offset=424
                      local.tee 1
                      i32.const -2147483648
                      i32.eq
                      if  ;; label = @10
                        local.get 0
                        local.get 6
                        i32.store8 offset=300
                        local.get 0
                        i32.const -2147483648
                        i32.store offset=296
                        br 7 (;@3;)
                      end
                      local.get 0
                      i32.const 368
                      i32.add
                      local.get 0
                      i32.const 432
                      i32.add
                      i32.load align=1
                      i32.store align=1
                      local.get 0
                      local.get 0
                      i32.load offset=429 align=1
                      i32.store offset=365 align=1
                      local.get 0
                      local.get 6
                      i32.store8 offset=364
                      local.get 0
                      local.get 1
                      i32.store offset=360
                      local.get 0
                      i32.const 492
                      i32.add
                      local.get 0
                      i32.const 360
                      i32.add
                      call 37
                      local.get 0
                      i32.load offset=360
                      local.get 0
                      i32.load offset=364
                      call 8
                      local.get 5
                      i32.const 40
                      i32.mul
                      local.set 15
                      local.get 0
                      i32.const 237
                      i32.add
                      local.set 16
                      local.get 0
                      i32.const 301
                      i32.add
                      local.set 22
                      local.get 0
                      i32.const 365
                      i32.add
                      local.set 7
                      local.get 0
                      i32.const 429
                      i32.add
                      local.set 17
                      local.get 0
                      i32.const 529
                      i32.add
                      local.set 18
                      local.get 0
                      i32.const 509
                      i32.add
                      local.set 19
                      local.get 0
                      i32.const 531
                      i32.add
                      local.set 11
                      local.get 3
                      local.set 2
                      loop  ;; label = @10
                        block  ;; label = @11
                          block  ;; label = @12
                            block  ;; label = @13
                              block  ;; label = @14
                                block  ;; label = @15
                                  block  ;; label = @16
                                    local.get 15
                                    if  ;; label = @17
                                      local.get 0
                                      i32.const 8
                                      i32.add
                                      local.get 2
                                      call 35
                                      call 26
                                      local.get 0
                                      i32.load offset=12
                                      local.set 1
                                      local.get 0
                                      i32.load offset=8
                                      local.tee 6
                                      i32.const -2147483648
                                      i32.eq
                                      br_if 5 (;@12;)
                                      local.get 0
                                      local.get 1
                                      i32.store8 offset=528
                                      local.get 11
                                      local.get 1
                                      i32.const 24
                                      i32.shr_u
                                      i32.store8
                                      local.get 0
                                      i32.const 0
                                      i32.store offset=532
                                      local.get 0
                                      local.get 6
                                      i32.store offset=524
                                      local.get 0
                                      local.get 1
                                      i32.const 8
                                      i32.shr_u
                                      i32.store16 offset=529 align=1
                                      local.get 0
                                      i32.const 424
                                      i32.add
                                      local.tee 8
                                      local.get 2
                                      i32.load offset=32
                                      local.get 2
                                      i32.load offset=36
                                      call 34
                                      local.get 0
                                      i32.load8_u offset=428
                                      local.set 1
                                      local.get 0
                                      i32.load offset=424
                                      local.tee 4
                                      i32.const -2147483648
                                      i32.eq
                                      br_if 3 (;@14;)
                                      local.get 7
                                      local.get 17
                                      i32.load align=1
                                      i32.store align=1
                                      local.get 7
                                      i32.const 3
                                      i32.add
                                      local.tee 9
                                      local.get 17
                                      i32.const 3
                                      i32.add
                                      i32.load align=1
                                      i32.store align=1
                                      local.get 0
                                      local.get 1
                                      i32.store8 offset=364
                                      local.get 0
                                      local.get 4
                                      i32.store offset=360
                                      local.get 0
                                      i32.const 524
                                      i32.add
                                      local.get 0
                                      i32.const 360
                                      i32.add
                                      call 37
                                      local.get 0
                                      i32.load offset=360
                                      local.get 0
                                      i32.load offset=364
                                      call 8
                                      local.get 8
                                      local.get 2
                                      call 38
                                      i32.const 0
                                      local.set 6
                                      block (result i32)  ;; label = @18
                                        block  ;; label = @19
                                          local.get 2
                                          i32.load offset=24
                                          local.tee 8
                                          i32.const 0
                                          i32.ge_s
                                          if  ;; label = @20
                                            local.get 2
                                            i32.load offset=20
                                            local.set 1
                                            local.get 8
                                            i32.eqz
                                            if  ;; label = @21
                                              i32.const 1
                                              local.set 4
                                              i32.const 0
                                              br 3 (;@18;)
                                            end
                                            i32.const 1
                                            local.set 6
                                            i32.const 1
                                            local.get 8
                                            call 11
                                            local.tee 4
                                            br_if 1 (;@19;)
                                          end
                                          local.get 6
                                          call 16
                                          unreachable
                                        end
                                        local.get 8
                                      end
                                      local.set 6
                                      local.get 0
                                      local.get 4
                                      i32.store offset=444
                                      local.get 0
                                      local.get 6
                                      i32.store offset=440
                                      local.get 8
                                      if  ;; label = @18
                                        local.get 4
                                        local.get 1
                                        local.get 8
                                        memory.copy
                                      end
                                      local.get 0
                                      local.get 8
                                      i32.store offset=448
                                      local.get 0
                                      i32.const 360
                                      i32.add
                                      local.get 4
                                      local.get 8
                                      call 34
                                      local.get 6
                                      local.get 4
                                      call 8
                                      local.get 0
                                      i32.load8_u offset=364
                                      local.set 1
                                      local.get 0
                                      i32.load offset=360
                                      local.tee 6
                                      i32.const -2147483648
                                      i32.eq
                                      br_if 1 (;@16;)
                                      local.get 22
                                      local.get 7
                                      i32.load align=1
                                      i32.store align=1
                                      local.get 22
                                      i32.const 3
                                      i32.add
                                      local.tee 4
                                      local.get 9
                                      i32.load align=1
                                      i32.store align=1
                                      local.get 0
                                      local.get 1
                                      i32.store8 offset=300
                                      local.get 0
                                      local.get 6
                                      i32.store offset=296
                                      local.get 0
                                      i32.const 424
                                      i32.add
                                      local.get 0
                                      i32.const 296
                                      i32.add
                                      call 39
                                      local.get 0
                                      i32.load offset=296
                                      local.set 6
                                      i32.const 255
                                      i32.and
                                      local.tee 1
                                      i32.const 6
                                      i32.ne
                                      if  ;; label = @18
                                        local.get 6
                                        local.get 0
                                        i32.load offset=300
                                        call 8
                                        br 2 (;@16;)
                                      end
                                      local.get 0
                                      local.get 22
                                      i32.load align=1
                                      i32.store offset=536
                                      local.get 0
                                      local.get 4
                                      i32.load align=1
                                      i32.store offset=539 align=1
                                      local.get 0
                                      i32.load8_u offset=300
                                      local.set 1
                                      br 2 (;@15;)
                                    end
                                    local.get 0
                                    i32.const 304
                                    i32.add
                                    local.get 0
                                    i32.const 500
                                    i32.add
                                    i32.load
                                    i32.store
                                    local.get 0
                                    local.get 0
                                    i64.load offset=492 align=4
                                    i64.store offset=296
                                    br 14 (;@2;)
                                  end
                                  i32.const -2147483648
                                  local.set 6
                                end
                                local.get 0
                                i32.const 424
                                i32.add
                                call 40
                                local.get 6
                                i32.const -2147483648
                                i32.ne
                                br_if 1 (;@13;)
                                local.get 0
                                i32.load offset=524
                                local.set 6
                              end
                              local.get 6
                              local.get 0
                              i32.load offset=528
                              call 8
                              br 1 (;@12;)
                            end
                            local.get 16
                            local.get 0
                            i32.load offset=536
                            i32.store align=1
                            local.get 16
                            i32.const 3
                            i32.add
                            local.get 0
                            i32.load offset=539 align=1
                            i32.store align=1
                            local.get 0
                            local.get 1
                            i32.store8 offset=236
                            local.get 0
                            local.get 6
                            i32.store offset=232
                            local.get 0
                            i32.const 524
                            i32.add
                            local.get 0
                            i32.const 232
                            i32.add
                            call 37
                            local.get 0
                            i32.load offset=232
                            local.get 0
                            i32.load offset=236
                            call 8
                            local.get 0
                            local.get 18
                            i32.load align=1
                            i32.store offset=516
                            local.get 0
                            local.get 18
                            i32.const 3
                            i32.add
                            i32.load align=1
                            i32.store offset=519 align=1
                            local.get 0
                            i32.load8_u offset=528
                            local.set 1
                            local.get 0
                            i32.load offset=524
                            local.tee 6
                            i32.const -2147483648
                            i32.ne
                            br_if 1 (;@11;)
                          end
                          local.get 0
                          local.get 1
                          i32.store8 offset=300
                          local.get 0
                          i32.const -2147483648
                          i32.store offset=296
                          local.get 0
                          i32.load offset=496
                          local.set 2
                          local.get 0
                          i32.load offset=492
                          local.set 4
                          br 8 (;@3;)
                        end
                        local.get 19
                        local.get 0
                        i32.load offset=516
                        i32.store align=1
                        local.get 19
                        i32.const 3
                        i32.add
                        local.get 0
                        i32.load offset=519 align=1
                        i32.store align=1
                        local.get 0
                        local.get 1
                        i32.store8 offset=508
                        local.get 0
                        local.get 6
                        i32.store offset=504
                        local.get 0
                        i32.const 492
                        i32.add
                        local.get 0
                        i32.const 504
                        i32.add
                        call 37
                        local.get 0
                        i32.load offset=504
                        local.get 0
                        i32.load offset=508
                        call 8
                        local.get 15
                        i32.const 40
                        i32.sub
                        local.set 15
                        local.get 2
                        i32.const 40
                        i32.add
                        local.set 2
                        br 0 (;@10;)
                      end
                      unreachable
                    end
                    local.get 0
                    i32.load offset=432
                    drop
                    local.get 2
                    call 16
                    unreachable
                  end
                  br 6 (;@1;)
                end
                br 5 (;@1;)
              end
              br 4 (;@1;)
            end
            loop  ;; label = @5
              br 0 (;@5;)
            end
            unreachable
          end
          i32.const 2
          call 9
          unreachable
        end
        local.get 4
        local.get 2
        call 8
      end
      local.get 3
      local.set 1
      loop  ;; label = @2
        local.get 5
        if  ;; label = @3
          local.get 1
          i32.const 28
          i32.add
          i32.load
          local.get 1
          i32.const 32
          i32.add
          i32.load
          call 8
          local.get 1
          call 40
          local.get 1
          i32.const 16
          i32.add
          i32.load
          local.get 1
          i32.const 20
          i32.add
          i32.load
          call 8
          local.get 5
          i32.const 1
          i32.sub
          local.set 5
          local.get 1
          i32.const 40
          i32.add
          local.set 1
          br 1 (;@2;)
        end
      end
      local.get 20
      local.get 3
      i32.const 4
      i32.const 40
      call 41
      local.get 0
      i32.const 424
      i32.add
      local.tee 5
      local.get 0
      i32.const 296
      i32.add
      call 32
      local.get 0
      i32.load offset=424
      local.set 3
      local.get 23
      local.get 21
      local.get 10
      local.get 13
      local.get 0
      i32.load offset=428
      local.tee 2
      local.get 0
      i32.load offset=432
      local.get 5
      call 4
      call 20
      call 27
      block  ;; label = @2
        local.get 0
        i32.load offset=424
        local.tee 1
        if  ;; label = @3
          local.get 1
          call 19
          local.tee 3
          local.get 1
          local.get 5
          call 5
          call 20
          local.tee 2
          i32.const 255
          i32.and
          i32.const 55
          i32.ne
          br_if 1 (;@2;)
          local.get 1
          local.get 3
          call 8
          i32.const 18
          call 9
          unreachable
        end
        i32.const 0
        i32.const 1
        call 8
        local.get 3
        local.get 2
        call 8
        local.get 14
        local.get 10
        call 8
        local.get 12
        local.get 23
        call 8
        local.get 0
        i32.const 544
        i32.add
        global.set 0
        return
      end
      local.get 2
      call 42
      unreachable
    end
    global.get 0
    i32.const 16
    i32.sub
    global.set 0
    loop  ;; label = @1
      br 0 (;@1;)
    end
    unreachable)
  (func (;18;) (type 4) (param i32 i32 i32)
    (local i32 i32 i32)
    global.get 0
    i32.const 16
    i32.sub
    local.tee 3
    global.set 0
    local.get 3
    i32.const 0
    i32.store offset=12
    block  ;; label = @1
      local.get 1
      local.get 2
      local.get 3
      i32.const 12
      i32.add
      call 7
      call 20
      local.tee 1
      i32.const 255
      i32.and
      local.tee 2
      i32.const 1
      i32.ne
      if  ;; label = @2
        local.get 2
        i32.const 55
        i32.ne
        br_if 1 (;@1;)
        local.get 3
        i32.load offset=12
        local.set 5
        i32.const 1
        local.set 4
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
    call 9
    unreachable)
  (func (;19;) (type 2) (param i32) (result i32)
    (local i32)
    local.get 0
    i32.const 34
    local.get 0
    i32.const 0
    i32.ge_s
    local.tee 1
    select
    local.set 0
    block  ;; label = @1
      local.get 1
      if  ;; label = @2
        i32.const 1
        local.get 0
        call 11
        local.tee 0
        i32.eqz
        br_if 1 (;@1;)
        local.get 0
        return
      end
      local.get 0
      call 9
      unreachable
    end
    i32.const 19
    call 42
    unreachable)
  (func (;20;) (type 2) (param i32) (result i32)
    (local i32 i32 i32 i32)
    i32.const 55
    local.set 3
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
                                                                                                          local.set 2
                                                                                                          br 49 (;@2;)
                                                                                                        end
                                                                                                        i32.const 2
                                                                                                        local.set 2
                                                                                                        br 48 (;@2;)
                                                                                                      end
                                                                                                      i32.const 3
                                                                                                      local.set 2
                                                                                                      br 47 (;@2;)
                                                                                                    end
                                                                                                    i32.const 4
                                                                                                    local.set 2
                                                                                                    br 46 (;@2;)
                                                                                                  end
                                                                                                  i32.const 5
                                                                                                  local.set 2
                                                                                                  br 45 (;@2;)
                                                                                                end
                                                                                                i32.const 6
                                                                                                local.set 2
                                                                                                br 44 (;@2;)
                                                                                              end
                                                                                              i32.const 7
                                                                                              local.set 2
                                                                                              br 43 (;@2;)
                                                                                            end
                                                                                            i32.const 8
                                                                                            local.set 2
                                                                                            br 42 (;@2;)
                                                                                          end
                                                                                          i32.const 9
                                                                                          local.set 2
                                                                                          br 41 (;@2;)
                                                                                        end
                                                                                        i32.const 10
                                                                                        local.set 2
                                                                                        br 40 (;@2;)
                                                                                      end
                                                                                      i32.const 11
                                                                                      local.set 2
                                                                                      br 39 (;@2;)
                                                                                    end
                                                                                    i32.const 12
                                                                                    local.set 2
                                                                                    br 38 (;@2;)
                                                                                  end
                                                                                  i32.const 13
                                                                                  local.set 2
                                                                                  br 37 (;@2;)
                                                                                end
                                                                                i32.const 14
                                                                                local.set 2
                                                                                br 36 (;@2;)
                                                                              end
                                                                              i32.const 15
                                                                              local.set 2
                                                                              br 35 (;@2;)
                                                                            end
                                                                            i32.const 16
                                                                            local.set 2
                                                                            br 34 (;@2;)
                                                                          end
                                                                          i32.const 17
                                                                          local.set 2
                                                                          br 33 (;@2;)
                                                                        end
                                                                        i32.const 18
                                                                        local.set 2
                                                                        br 32 (;@2;)
                                                                      end
                                                                      i32.const 19
                                                                      local.set 2
                                                                      br 31 (;@2;)
                                                                    end
                                                                    i32.const 20
                                                                    local.set 2
                                                                    br 30 (;@2;)
                                                                  end
                                                                  i32.const 21
                                                                  local.set 2
                                                                  br 29 (;@2;)
                                                                end
                                                                i32.const 22
                                                                local.set 2
                                                                br 28 (;@2;)
                                                              end
                                                              i32.const 23
                                                              local.set 2
                                                              br 27 (;@2;)
                                                            end
                                                            i32.const 24
                                                            local.set 2
                                                            br 26 (;@2;)
                                                          end
                                                          i32.const 25
                                                          local.set 2
                                                          br 25 (;@2;)
                                                        end
                                                        i32.const 26
                                                        local.set 2
                                                        br 24 (;@2;)
                                                      end
                                                      i32.const 27
                                                      local.set 2
                                                      br 23 (;@2;)
                                                    end
                                                    i32.const 28
                                                    local.set 2
                                                    br 22 (;@2;)
                                                  end
                                                  i32.const 29
                                                  local.set 2
                                                  br 21 (;@2;)
                                                end
                                                i32.const 30
                                                local.set 2
                                                br 20 (;@2;)
                                              end
                                              i32.const 31
                                              local.set 2
                                              br 19 (;@2;)
                                            end
                                            i32.const 32
                                            local.set 2
                                            br 18 (;@2;)
                                          end
                                          i32.const 33
                                          local.set 2
                                          br 17 (;@2;)
                                        end
                                        i32.const 34
                                        local.set 2
                                        br 16 (;@2;)
                                      end
                                      i32.const 35
                                      local.set 2
                                      br 15 (;@2;)
                                    end
                                    i32.const 36
                                    local.set 2
                                    br 14 (;@2;)
                                  end
                                  i32.const 37
                                  local.set 2
                                  br 13 (;@2;)
                                end
                                i32.const 38
                                local.set 2
                                br 12 (;@2;)
                              end
                              i32.const 39
                              local.set 2
                              br 11 (;@2;)
                            end
                            i32.const 45
                            local.set 2
                            br 10 (;@2;)
                          end
                          i32.const 46
                          local.set 2
                          br 9 (;@2;)
                        end
                        i32.const 47
                        local.set 2
                        br 8 (;@2;)
                      end
                      i32.const 48
                      local.set 2
                      br 7 (;@2;)
                    end
                    i32.const 49
                    local.set 2
                    br 6 (;@2;)
                  end
                  i32.const 50
                  local.set 2
                  br 5 (;@2;)
                end
                i32.const 51
                local.set 2
                br 4 (;@2;)
              end
              i32.const 52
              local.set 2
              br 3 (;@2;)
            end
            i32.const 53
            local.set 2
            br 2 (;@2;)
          end
          i32.const 54
          local.set 2
          br 1 (;@2;)
        end
        block (result i32)  ;; label = @3
          block  ;; label = @4
            block  ;; label = @5
              local.get 0
              i32.const -65536
              i32.and
              i32.const 65536
              i32.ne
              if  ;; label = @6
                local.get 0
                i32.const -256
                i32.and
                local.tee 3
                i32.const 64768
                i32.eq
                br_if 1 (;@5;)
                local.get 3
                i32.const 65024
                i32.eq
                br_if 2 (;@4;)
                i32.const 43
                local.set 2
                local.get 0
                local.set 4
                local.get 3
                i32.const 65280
                i32.eq
                br_if 4 (;@2;)
                i32.const 40
                i32.const 30
                local.get 3
                i32.const 64512
                i32.eq
                local.tee 0
                select
                local.set 2
                local.get 4
                i32.const 0
                local.get 0
                select
                local.set 4
                br 4 (;@2;)
              end
              local.get 0
              i32.const 16
              i32.shl
              local.set 1
              i32.const 44
              local.set 2
              br 3 (;@2;)
            end
            i32.const 41
            br 1 (;@3;)
          end
          i32.const 42
        end
        local.set 2
        local.get 0
        local.set 4
      end
      local.get 4
      i32.const 8
      i32.shl
      i32.const 65280
      i32.and
      local.get 1
      local.get 2
      i32.or
      i32.or
      local.set 3
    end
    local.get 3)
  (func (;21;) (type 0) (param i32 i32)
    local.get 1
    i32.load
    i32.const -2147483648
    i32.eq
    if  ;; label = @1
      local.get 1
      i32.load offset=4
      call 9
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
  (func (;22;) (type 4) (param i32 i32 i32)
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
    call 23
    block  ;; label = @1
      local.get 3
      i32.load
      local.tee 2
      i32.eqz
      if  ;; label = @2
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
  (func (;23;) (type 3) (param i32 i32 i32 i32)
    block  ;; label = @1
      local.get 2
      local.get 3
      i32.ge_u
      if  ;; label = @2
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
  (func (;24;) (type 3) (param i32 i32 i32 i32)
    local.get 1
    local.get 3
    i32.le_u
    if  ;; label = @1
      local.get 0
      local.get 1
      i32.store offset=4
      local.get 0
      local.get 2
      i32.store
      return
    end
    local.get 1
    local.get 3
    i32.le_u
    if  ;; label = @1
      call 50
      unreachable
    end
    call 50
    unreachable)
  (func (;25;) (type 3) (param i32 i32 i32 i32)
    local.get 1
    local.get 3
    i32.eq
    if  ;; label = @1
      local.get 1
      if  ;; label = @2
        local.get 0
        local.get 2
        local.get 1
        memory.copy
      end
      return
    end
    global.get 0
    i32.const 16
    i32.sub
    global.set 0
    loop  ;; label = @1
      br 0 (;@1;)
    end
    unreachable)
  (func (;26;) (type 0) (param i32 i32)
    (local i32 i32)
    global.get 0
    i32.const 16
    i32.sub
    local.tee 2
    global.set 0
    local.get 2
    i32.const 4
    i32.add
    local.get 1
    call 15
    local.get 2
    i32.load offset=8
    local.set 1
    local.get 2
    i32.load offset=4
    i32.const 1
    i32.eq
    if  ;; label = @1
      local.get 2
      i32.load offset=12
      local.set 3
      local.get 1
      call 16
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
  (func (;27;) (type 1) (param i32)
    local.get 0
    i32.const 255
    i32.and
    i32.const 55
    i32.ne
    if  ;; label = @1
      local.get 0
      call 9
      unreachable
    end)
  (func (;28;) (type 0) (param i32 i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32 i32 i64 i64)
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
    local.tee 6
    local.get 1
    i32.load offset=8
    call 22
    block  ;; label = @1
      block  ;; label = @2
        block (result i32)  ;; label = @3
          local.get 2
          i32.load8_u offset=40
          local.tee 5
          local.get 2
          i32.load offset=72
          local.tee 3
          i32.eqz
          br_if 0 (;@3;)
          drop
          local.get 2
          i32.const 103
          i32.add
          local.get 2
          i32.const -64
          i32.sub
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
          i32.const 88
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
          i32.const 0
          local.get 2
          i32.load offset=76
          local.tee 7
          i32.eqz
          br_if 0 (;@3;)
          drop
          local.get 3
          i32.load8_u
          local.tee 8
          i32.const 8
          i32.lt_u
          br_if 1 (;@2;)
          i32.const 1
        end
        local.set 5
        local.get 0
        i32.const 1
        i32.store8
        local.get 0
        local.get 5
        i32.store8 offset=1
        br 1 (;@1;)
      end
      local.get 2
      i32.const 31
      i32.add
      local.tee 3
      local.get 2
      i32.const 103
      i32.add
      i64.load align=1
      i64.store align=1
      local.get 2
      i32.const 24
      i32.add
      local.tee 4
      local.get 2
      i32.const 96
      i32.add
      i64.load
      i64.store
      local.get 2
      i32.const 16
      i32.add
      local.get 2
      i32.const 88
      i32.add
      i64.load
      local.tee 12
      i64.store
      local.get 2
      local.get 2
      i64.load offset=80
      local.tee 13
      i64.store offset=8
      local.get 2
      i32.const 63
      i32.add
      local.tee 9
      local.get 3
      i64.load align=1
      i64.store align=1
      local.get 2
      i32.const 56
      i32.add
      local.tee 10
      local.get 4
      i64.load
      i64.store
      local.get 2
      i32.const 48
      i32.add
      local.tee 11
      local.get 12
      i64.store
      local.get 2
      local.get 13
      i64.store offset=40
      i32.const 1
      local.set 4
      i32.const 2
      local.set 3
      local.get 7
      i32.const 1
      i32.eq
      if  ;; label = @2
        local.get 0
        local.get 2
        i64.load offset=40
        i64.store offset=2 align=1
        local.get 0
        local.get 8
        i32.store8 offset=33
        local.get 0
        i32.const 25
        i32.add
        local.get 9
        i64.load align=1
        i64.store align=1
        local.get 0
        i32.const 18
        i32.add
        local.get 10
        i64.load
        i64.store align=1
        local.get 0
        i32.const 10
        i32.add
        local.get 11
        i64.load
        i64.store align=1
        i32.const 0
        local.set 4
        local.get 5
        local.set 3
      end
      local.get 0
      local.get 4
      i32.store8
      local.get 0
      local.get 3
      i32.store8 offset=1
    end
    local.get 1
    i32.load
    local.get 6
    call 8
    local.get 2
    i32.const 112
    i32.add
    global.set 0)
  (func (;29;) (type 0) (param i32 i32)
    (local i32)
    local.get 1
    i32.const 1
    i32.add
    local.set 2
    local.get 1
    i32.load8_u
    i32.const 1
    i32.ne
    if  ;; label = @1
      local.get 0
      local.get 2
      i32.const 33
      memory.copy
      return
    end
    local.get 2
    i32.load8_u
    call 43
    call 9
    unreachable)
  (func (;30;) (type 0) (param i32 i32)
    (local i32 i32)
    global.get 0
    i32.const 32
    i32.sub
    local.tee 2
    global.set 0
    local.get 2
    i32.const 20
    i32.add
    local.tee 3
    local.get 1
    call 33
    local.get 2
    i32.const 8
    i32.add
    local.get 3
    call 32
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
  (func (;31;) (type 0) (param i32 i32)
    (local i32 i32 i32 i32 i32 i32 i32 i32 i32)
    global.get 0
    i32.const 144
    i32.sub
    local.tee 2
    global.set 0
    i32.const 64
    local.set 3
    local.get 2
    i32.const 40
    i32.add
    i32.const 0
    i32.const 64
    memory.fill
    loop  ;; label = @1
      local.get 3
      if  ;; label = @2
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
        call 24
        local.get 2
        i32.load offset=36
        local.set 6
        local.get 2
        i32.load offset=32
        local.get 2
        local.get 1
        local.get 4
        i32.add
        i64.load
        i64.store offset=128
        local.get 6
        local.get 2
        i32.const 128
        i32.add
        i32.const 8
        call 25
        local.get 3
        i32.const 8
        i32.sub
        local.set 3
        local.get 4
        i32.const 8
        i32.add
        local.set 4
        br 1 (;@1;)
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
    local.tee 1
    i32.store offset=108
    local.get 2
    local.get 2
    i32.const 40
    i32.add
    i32.store offset=104
    local.get 2
    i32.const 24
    i32.add
    local.get 1
    call 49
    block  ;; label = @1
      local.get 2
      i32.load8_u offset=24
      if  ;; label = @2
        local.get 2
        i32.load8_u offset=25
        local.set 3
        local.get 2
        i32.const 16
        i32.add
        i32.const 8
        call 26
        local.get 2
        i32.load offset=16
        local.set 4
        local.get 2
        i32.load offset=20
        local.tee 1
        local.get 3
        i32.store8
        local.get 2
        i32.const 1
        i32.store offset=124
        local.get 2
        local.get 1
        i32.store offset=120
        local.get 2
        local.get 4
        i32.store offset=116
        local.get 2
        i32.const 136
        i32.add
        local.get 2
        i32.const 112
        i32.add
        i32.load
        i32.store
        local.get 2
        local.get 2
        i64.load offset=104 align=4
        i64.store offset=128
        i32.const 1
        local.set 3
        loop  ;; label = @3
          local.get 2
          i32.const 8
          i32.add
          local.get 2
          i32.const 128
          i32.add
          call 49
          local.get 2
          i32.load8_u offset=8
          if  ;; label = @4
            local.get 2
            i32.load8_u offset=9
            local.set 4
            local.get 2
            i32.load offset=116
            local.get 3
            i32.eq
            if  ;; label = @5
              local.get 2
              i32.const 116
              i32.add
              i32.const 1
              call 47
              local.get 2
              i32.load offset=120
              local.set 1
            end
            local.get 1
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
            br 1 (;@3;)
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
    call 44
    local.get 2
    i32.const 128
    i32.add
    local.tee 5
    local.get 2
    i32.load offset=120
    local.tee 3
    local.get 2
    i32.load offset=124
    local.tee 4
    i32.const 1
    i32.shr_u
    local.tee 1
    local.get 1
    call 46
    local.get 2
    i32.load offset=132
    local.set 6
    local.get 2
    i32.load offset=128
    local.set 8
    local.get 5
    local.get 3
    local.get 4
    i32.add
    local.get 1
    i32.sub
    local.get 1
    local.get 1
    call 46
    local.get 2
    i32.load offset=132
    local.set 5
    local.get 2
    i32.load offset=128
    local.set 9
    i32.const 0
    local.set 4
    local.get 1
    i32.const 1
    i32.sub
    local.tee 1
    local.set 3
    block  ;; label = @1
      block  ;; label = @2
        loop  ;; label = @3
          local.get 3
          i32.const -1
          i32.eq
          br_if 1 (;@2;)
          local.get 4
          local.get 6
          i32.eq
          br_if 2 (;@1;)
          local.get 1
          local.get 5
          i32.lt_u
          if  ;; label = @4
            local.get 4
            local.get 8
            i32.add
            local.tee 7
            i32.load8_u
            local.set 10
            local.get 7
            local.get 3
            local.get 9
            i32.add
            local.tee 7
            i32.load8_u
            i32.store8
            local.get 7
            local.get 10
            i32.store8
            local.get 3
            i32.const 1
            i32.sub
            local.set 3
            local.get 4
            i32.const 1
            i32.add
            local.set 4
            br 1 (;@3;)
          end
        end
        call 50
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
      i32.const 124
      i32.add
      i32.load
      i32.store
      local.get 2
      i32.const 144
      i32.add
      global.set 0
      return
    end
    call 50
    unreachable)
  (func (;32;) (type 0) (param i32 i32)
    local.get 1
    i32.load
    i32.const -2147483648
    i32.eq
    if  ;; label = @1
      local.get 1
      i32.load8_u offset=4
      call 43
      call 9
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
  (func (;33;) (type 0) (param i32 i32)
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
    call 26
    local.get 2
    i32.const 0
    i32.store offset=32
    local.get 2
    local.get 2
    i32.load offset=20
    local.tee 5
    i32.store offset=28
    local.get 2
    local.get 2
    i32.load offset=16
    local.tee 6
    i32.store offset=24
    local.get 2
    i32.const 8
    i32.add
    i32.const 32
    call 26
    local.get 2
    i32.load offset=8
    local.set 4
    local.get 2
    i32.load offset=12
    local.tee 3
    local.get 1
    i64.load align=1
    i64.store align=1
    local.get 3
    i32.const 24
    i32.add
    local.get 1
    i32.const 24
    i32.add
    i64.load align=1
    i64.store align=1
    local.get 3
    i32.const 16
    i32.add
    local.get 1
    i32.const 16
    i32.add
    i64.load align=1
    i64.store align=1
    local.get 3
    i32.const 8
    i32.add
    local.get 1
    i32.const 8
    i32.add
    i64.load align=1
    i64.store align=1
    block  ;; label = @1
      block  ;; label = @2
        local.get 4
        i32.const -2147483648
        i32.ne
        if  ;; label = @3
          local.get 2
          local.get 3
          i32.store8 offset=40
          local.get 2
          i32.const 43
          i32.add
          local.tee 5
          local.get 3
          i32.const 24
          i32.shr_u
          i32.store8
          local.get 2
          i32.const 32
          i32.store offset=44
          local.get 2
          local.get 4
          i32.store offset=36
          local.get 2
          local.get 3
          i32.const 8
          i32.shr_u
          i32.store16 offset=41 align=1
          local.get 2
          i32.const 24
          i32.add
          local.tee 3
          local.get 2
          i32.const 36
          i32.add
          local.tee 4
          call 37
          local.get 2
          i32.load offset=36
          local.get 2
          i32.load offset=40
          call 8
          local.get 1
          i32.load8_u offset=32
          local.set 6
          i32.const 1
          i32.const 1
          call 11
          local.tee 1
          i32.eqz
          br_if 1 (;@2;)
          local.get 1
          local.get 6
          i32.store8
          local.get 5
          local.get 1
          i32.const 24
          i32.shr_u
          i32.store8
          local.get 2
          i32.const 1
          i32.store offset=44
          local.get 2
          local.get 1
          i32.store8 offset=40
          local.get 2
          i32.const 1
          i32.store offset=36
          local.get 2
          local.get 1
          i32.const 8
          i32.shr_u
          i32.store16 offset=41 align=1
          local.get 3
          local.get 4
          call 37
          local.get 2
          i32.load offset=36
          local.get 2
          i32.load offset=40
          call 8
          local.get 0
          i32.const 8
          i32.add
          local.get 2
          i32.const 32
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
        local.get 3
        i32.store8 offset=4
        local.get 6
        local.get 5
        call 8
        br 1 (;@1;)
      end
      loop  ;; label = @2
        br 0 (;@2;)
      end
      unreachable
    end
    local.get 2
    i32.const 48
    i32.add
    global.set 0)
  (func (;34;) (type 4) (param i32 i32 i32)
    (local i32 i32 i32)
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
    call 26
    local.get 3
    i32.const 24
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
    local.tee 5
    local.get 3
    i32.const 28
    i32.add
    i32.const 4
    call 48
    local.get 5
    local.get 1
    local.get 2
    call 48
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
  (func (;35;) (type 2) (param i32) (result i32)
    local.get 0
    i32.load offset=36
    local.get 0
    call 51
    local.get 0
    i32.load offset=24
    i32.add
    i32.add
    i32.const 8
    i32.add)
  (func (;36;) (type 0) (param i32 i32)
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
    call 26
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
  (func (;37;) (type 0) (param i32 i32)
    (local i32 i32 i32)
    local.get 1
    i32.load offset=4
    local.set 4
    local.get 0
    local.get 1
    i32.load offset=8
    local.tee 2
    call 47
    local.get 0
    i32.load offset=8
    local.set 3
    local.get 2
    if  ;; label = @1
      local.get 0
      i32.load offset=4
      local.get 3
      i32.add
      local.get 4
      local.get 2
      memory.copy
    end
    local.get 1
    i32.const 0
    i32.store offset=8
    local.get 0
    local.get 2
    local.get 3
    i32.add
    i32.store offset=8)
  (func (;38;) (type 0) (param i32 i32)
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
                                                  i32.const 1
                                                  i32.sub
                                                  br_table 1 (;@22;) 2 (;@21;) 3 (;@20;) 4 (;@19;) 5 (;@18;) 6 (;@17;) 7 (;@16;) 8 (;@15;) 9 (;@14;) 10 (;@13;) 11 (;@12;) 12 (;@11;) 13 (;@10;) 14 (;@9;) 15 (;@8;) 16 (;@7;) 17 (;@6;) 18 (;@5;) 19 (;@4;) 20 (;@3;) 21 (;@2;) 22 (;@1;) 0 (;@23;)
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
                    call 52
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
                  call 52
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
              call 52
              local.set 2
              local.get 0
              local.get 1
              i32.const 8
              i32.add
              call 52
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
            call 52
            local.set 2
            local.get 0
            local.get 1
            i32.const 8
            i32.add
            call 52
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
          call 53
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
        call 53
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
      call 53
      local.get 0
      i32.const 21
      i32.store
      return
    end
    local.get 0
    i32.const 22
    i32.store)
  (func (;39;) (type 5) (param i32 i32) (result i32)
    (local i32 i32 i32)
    global.get 0
    i32.const 32
    i32.sub
    local.tee 3
    global.set 0
    loop  ;; label = @1
      i32.const 14
      local.set 2
      block (result i32)  ;; label = @2
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
                                                            i32.const 1
                                                            i32.sub
                                                            br_table 1 (;@27;) 2 (;@26;) 3 (;@25;) 4 (;@24;) 5 (;@23;) 6 (;@22;) 7 (;@21;) 8 (;@20;) 9 (;@19;) 10 (;@18;) 11 (;@17;) 12 (;@16;) 13 (;@15;) 14 (;@14;) 15 (;@13;) 22 (;@6;) 16 (;@12;) 17 (;@11;) 18 (;@10;) 19 (;@9;) 20 (;@8;) 21 (;@7;) 0 (;@28;)
                                                          end
                                                          local.get 1
                                                          i32.const 0
                                                          call 44
                                                          br 22 (;@5;)
                                                        end
                                                        local.get 1
                                                        i32.const 1
                                                        call 44
                                                        br 21 (;@5;)
                                                      end
                                                      local.get 1
                                                      i32.const 2
                                                      call 44
                                                      br 20 (;@5;)
                                                    end
                                                    local.get 1
                                                    i32.const 3
                                                    call 44
                                                    br 19 (;@5;)
                                                  end
                                                  local.get 1
                                                  i32.const 4
                                                  call 44
                                                  br 18 (;@5;)
                                                end
                                                local.get 1
                                                i32.const 5
                                                call 44
                                                br 17 (;@5;)
                                              end
                                              i32.const 6
                                              local.set 2
                                              local.get 1
                                              i32.const 6
                                              call 44
                                              br 17 (;@4;)
                                            end
                                            local.get 1
                                            i32.const 7
                                            call 44
                                            br 15 (;@5;)
                                          end
                                          local.get 1
                                          i32.const 8
                                          call 44
                                          br 14 (;@5;)
                                        end
                                        local.get 1
                                        i32.const 9
                                        call 44
                                        br 13 (;@5;)
                                      end
                                      local.get 1
                                      i32.const 10
                                      call 44
                                      br 12 (;@5;)
                                    end
                                    local.get 1
                                    i32.const 11
                                    call 44
                                    br 11 (;@5;)
                                  end
                                  local.get 1
                                  i32.const 12
                                  call 44
                                  br 10 (;@5;)
                                end
                                local.get 1
                                i32.const 22
                                call 44
                                br 9 (;@5;)
                              end
                              i32.const 13
                              local.set 2
                            end
                            local.get 1
                            local.get 2
                            call 44
                            i32.const 4
                            br 10 (;@2;)
                          end
                          local.get 1
                          i32.const 16
                          call 44
                          local.get 0
                          i32.load offset=4
                          local.get 1
                          call 39
                          i32.const 255
                          i32.and
                          local.tee 2
                          i32.const 6
                          i32.ne
                          br_if 7 (;@4;)
                          br 8 (;@3;)
                        end
                        local.get 1
                        i32.const 17
                        call 44
                        local.get 0
                        i32.load offset=4
                        local.get 1
                        call 39
                        i32.const 255
                        i32.and
                        local.tee 2
                        i32.const 6
                        i32.eq
                        br_if 7 (;@3;)
                        br 6 (;@4;)
                      end
                      local.get 1
                      i32.const 18
                      call 44
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
                        local.get 0
                        local.get 4
                        i32.add
                        local.get 0
                        i32.const 4
                        i32.add
                        local.set 0
                        i32.load
                        local.get 1
                        call 39
                        i32.const 255
                        i32.and
                        local.tee 2
                        i32.const 6
                        i32.eq
                        br_if 0 (;@10;)
                      end
                      br 5 (;@4;)
                    end
                    local.get 1
                    i32.const 19
                    call 44
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
                      local.get 0
                      local.get 4
                      i32.add
                      local.get 0
                      i32.const 4
                      i32.add
                      local.set 0
                      i32.load
                      local.get 1
                      call 39
                      i32.const 255
                      i32.and
                      local.tee 2
                      i32.const 6
                      i32.eq
                      br_if 0 (;@9;)
                    end
                    br 4 (;@4;)
                  end
                  local.get 1
                  i32.const 20
                  call 44
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
                    local.get 4
                    i32.const 4
                    i32.add
                    local.set 4
                    i32.load
                    local.get 1
                    call 39
                    i32.const 255
                    i32.and
                    local.tee 2
                    i32.const 6
                    i32.eq
                    br_if 0 (;@8;)
                  end
                  br 3 (;@4;)
                end
                local.get 1
                i32.const 21
                call 44
                br 1 (;@5;)
              end
              local.get 1
              i32.const 15
              call 44
              local.get 3
              i32.const 20
              i32.add
              local.get 0
              i32.load offset=4
              call 36
              local.get 3
              i32.load8_u offset=24
              local.set 2
              local.get 3
              i32.load offset=20
              local.tee 0
              i32.const -2147483648
              i32.eq
              br_if 1 (;@4;)
              local.get 3
              i32.const 16
              i32.add
              local.get 3
              i32.const 28
              i32.add
              i32.load align=1
              i32.store align=1
              local.get 3
              local.get 3
              i32.load offset=25 align=1
              i32.store offset=13 align=1
              local.get 3
              local.get 2
              i32.store8 offset=12
              local.get 3
              local.get 0
              i32.store offset=8
              local.get 1
              local.get 3
              i32.const 8
              i32.add
              call 37
              local.get 3
              i32.load offset=8
              local.get 3
              i32.load offset=12
              call 8
            end
            i32.const 6
            local.set 2
          end
          local.get 3
          i32.const 32
          i32.add
          global.set 0
          local.get 2
          return
        end
        i32.const 8
      end
      local.set 2
      local.get 0
      local.get 2
      i32.add
      i32.load
      local.set 0
      br 0 (;@1;)
    end
    unreachable)
  (func (;40;) (type 1) (param i32)
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
              i32.const 14
              i32.sub
              br_table 1 (;@4;) 1 (;@4;) 4 (;@1;) 0 (;@5;) 0 (;@5;) 1 (;@4;) 2 (;@3;) 3 (;@2;) 4 (;@1;)
            end
            local.get 0
            i32.const 4
            i32.add
            call 45
            i32.const 8
            local.set 1
          end
          local.get 0
          local.get 1
          i32.add
          call 45
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
          call 45
          local.get 1
          i32.const 4
          i32.add
          local.set 1
          br 0 (;@3;)
        end
        unreachable
      end
      loop  ;; label = @2
        local.get 1
        i32.const 16
        i32.eq
        br_if 1 (;@1;)
        local.get 0
        local.get 1
        i32.add
        call 45
        local.get 1
        i32.const 4
        i32.add
        local.set 1
        br 0 (;@2;)
      end
      unreachable
    end)
  (func (;41;) (type 3) (param i32 i32 i32 i32)
    (local i32)
    global.get 0
    i32.const 16
    i32.sub
    local.tee 4
    global.set 0
    block (result i32)  ;; label = @1
      local.get 0
      i32.eqz
      if  ;; label = @2
        i32.const 0
        local.set 0
        local.get 4
        i32.const 12
        i32.add
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
    end
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
      local.tee 2
      i32.eqz
      br_if 0 (;@1;)
      local.get 1
      local.get 0
      local.get 2
      call 12
    end
    local.get 4
    i32.const 16
    i32.add
    global.set 0)
  (func (;42;) (type 1) (param i32)
    local.get 0
    call 9
    unreachable)
  (func (;43;) (type 2) (param i32) (result i32)
    local.get 0
    i32.const 255
    i32.and
    i32.const 2
    i32.shl
    i32.load offset=1049824)
  (func (;44;) (type 0) (param i32 i32)
    (local i32 i32 i32 i32 i32 i32 i32)
    local.get 0
    i32.load offset=8
    local.tee 7
    local.get 0
    i32.load
    i32.eq
    if  ;; label = @1
      global.get 0
      i32.const 16
      i32.sub
      local.tee 4
      global.set 0
      local.get 4
      i32.const 4
      i32.add
      local.set 6
      local.get 0
      i32.load
      local.tee 2
      local.set 5
      local.get 0
      i32.load offset=4
      local.set 8
      block (result i32)  ;; label = @2
        i32.const 8
        local.get 2
        i32.const 1
        i32.shl
        local.tee 2
        local.get 2
        i32.const 8
        i32.le_u
        select
        local.tee 2
        i32.const 0
        i32.lt_s
        if  ;; label = @3
          i32.const 1
          local.set 5
          i32.const 4
          br 1 (;@2;)
        end
        block (result i32)  ;; label = @3
          block (result i32)  ;; label = @4
            local.get 5
            if  ;; label = @5
              local.get 8
              local.get 5
              i32.const 1
              local.get 2
              call 10
              br 1 (;@4;)
            end
            i32.const 1
            local.get 2
            call 11
          end
          local.tee 3
          i32.eqz
          if  ;; label = @4
            local.get 6
            i32.const 1
            i32.store offset=4
            i32.const 1
            br 1 (;@3;)
          end
          local.get 6
          local.get 3
          i32.store offset=4
          i32.const 0
        end
        local.set 5
        local.get 2
        local.set 3
        i32.const 8
      end
      local.get 6
      i32.add
      local.get 3
      i32.store
      local.get 6
      local.get 5
      i32.store
      local.get 4
      i32.load offset=4
      i32.const 1
      i32.eq
      if  ;; label = @2
        local.get 4
        i32.load offset=12
        drop
        local.get 4
        i32.load offset=8
        call 16
        unreachable
      end
      local.get 4
      i32.load offset=8
      local.set 3
      local.get 0
      local.get 2
      i32.store
      local.get 0
      local.get 3
      i32.store offset=4
      local.get 4
      i32.const 16
      i32.add
      global.set 0
    end
    local.get 0
    local.get 7
    i32.const 1
    i32.add
    i32.store offset=8
    local.get 0
    i32.load offset=4
    local.get 7
    i32.add
    local.get 1
    i32.store8)
  (func (;45;) (type 1) (param i32)
    local.get 0
    i32.load
    local.tee 0
    call 40
    local.get 0
    i32.const 4
    i32.const 16
    call 12)
  (func (;46;) (type 3) (param i32 i32 i32 i32)
    local.get 2
    local.get 3
    i32.lt_u
    if  ;; label = @1
      loop  ;; label = @2
        br 0 (;@2;)
      end
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
  (func (;47;) (type 0) (param i32 i32)
    (local i32 i32 i32 i32 i32 i32 i32)
    global.get 0
    i32.const 32
    i32.sub
    local.tee 2
    global.set 0
    local.get 0
    i32.load
    local.tee 3
    local.get 0
    i32.load offset=8
    local.tee 4
    i32.sub
    local.get 1
    i32.lt_u
    if  ;; label = @1
      block  ;; label = @2
        local.get 1
        local.get 1
        local.get 4
        i32.add
        local.tee 5
        i32.gt_u
        if (result i32)  ;; label = @3
          i32.const 0
        else
          i32.const 0
          local.set 4
          local.get 2
          i32.const 20
          i32.add
          local.set 6
          i32.const 8
          local.get 5
          local.get 3
          i32.const 1
          i32.shl
          local.tee 1
          local.get 1
          local.get 5
          i32.lt_u
          select
          local.tee 1
          local.get 1
          i32.const 8
          i32.le_u
          select
          local.tee 1
          i32.const 0
          i32.ge_s
          if  ;; label = @4
            block (result i32)  ;; label = @5
              local.get 3
              i32.eqz
              if  ;; label = @6
                i32.const 0
                local.set 3
                local.get 2
                i32.const 28
                i32.add
                br 1 (;@5;)
              end
              local.get 0
              i32.load offset=4
              local.set 4
              local.get 2
              i32.const 1
              i32.store offset=28
              local.get 2
              i32.const 24
              i32.add
            end
            local.get 3
            i32.store
            block (result i32)  ;; label = @5
              local.get 2
              i32.load offset=28
              if  ;; label = @6
                local.get 2
                i32.load offset=24
                local.tee 3
                i32.eqz
                if  ;; label = @7
                  local.get 2
                  i32.const 8
                  i32.add
                  local.get 1
                  call 55
                  local.get 2
                  i32.load offset=8
                  br 2 (;@5;)
                end
                local.get 4
                local.get 3
                i32.const 1
                local.get 1
                call 10
                br 1 (;@5;)
              end
              local.get 2
              local.get 1
              call 55
              local.get 2
              i32.load
            end
            local.tee 3
            br_if 2 (;@2;)
            local.get 2
            i32.const 1
            i32.store offset=20
            local.get 2
            i32.const 16
            i32.add
            local.set 6
            local.get 1
            local.set 4
          end
          local.get 6
          local.get 4
          i32.store
          local.get 2
          i32.load offset=16
          local.set 1
          local.get 2
          i32.load offset=20
        end
        local.get 1
        local.set 8
        call 16
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
  (func (;48;) (type 4) (param i32 i32 i32)
    (local i32)
    local.get 0
    local.get 2
    call 47
    local.get 0
    i32.load offset=8
    local.set 3
    local.get 2
    if  ;; label = @1
      local.get 0
      i32.load offset=4
      local.get 3
      i32.add
      local.get 1
      local.get 2
      memory.copy
    end
    local.get 0
    local.get 2
    local.get 3
    i32.add
    i32.store offset=8)
  (func (;49;) (type 0) (param i32 i32)
    (local i32 i32 i32 i32 i32)
    local.get 1
    i32.load offset=4
    i32.const 1
    i32.sub
    local.set 2
    local.get 1
    i32.load
    local.set 3
    local.get 1
    i32.load8_u offset=8
    i32.const 1
    i32.and
    local.set 5
    block  ;; label = @1
      loop  ;; label = @2
        local.get 2
        i32.const 1
        i32.add
        local.tee 6
        local.get 3
        i32.eq
        br_if 1 (;@1;)
        local.get 1
        local.get 2
        i32.store offset=4
        local.get 2
        i32.load8_u
        local.set 4
        local.get 5
        i32.eqz
        if  ;; label = @3
          local.get 2
          i32.const 1
          i32.sub
          local.set 2
          local.get 4
          i32.eqz
          br_if 1 (;@2;)
        end
      end
      local.get 1
      i32.const 1
      i32.store8 offset=8
    end
    local.get 0
    local.get 4
    i32.store8 offset=1
    local.get 0
    local.get 3
    local.get 6
    i32.ne
    i32.store8)
  (func (;50;) (type 8)
    global.get 0
    i32.const 16
    i32.sub
    global.set 0
    loop  ;; label = @1
      br 0 (;@1;)
    end
    unreachable)
  (func (;51;) (type 2) (param i32) (result i32)
    (local i32 i32)
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
                    i32.const 14
                    i32.sub
                    br_table 6 (;@2;) 6 (;@2;) 0 (;@8;) 1 (;@7;) 2 (;@6;) 3 (;@5;) 4 (;@4;) 5 (;@3;) 7 (;@1;)
                  end
                  i32.const 4
                  local.set 1
                  br 6 (;@1;)
                end
                local.get 0
                i32.load offset=4
                call 51
                local.get 0
                i32.load offset=8
                call 51
                i32.add
                local.set 1
                br 5 (;@1;)
              end
              local.get 0
              i32.load offset=4
              call 51
              local.get 0
              i32.load offset=8
              call 51
              i32.add
              local.set 1
              br 4 (;@1;)
            end
            local.get 0
            i32.load offset=4
            call 51
            local.set 1
            br 3 (;@1;)
          end
          local.get 0
          i32.const 4
          i32.add
          local.set 0
          loop  ;; label = @4
            local.get 0
            local.get 2
            i32.add
            i32.load
            call 51
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
          end
          br 2 (;@1;)
        end
        i32.const 4
        local.set 2
        loop  ;; label = @3
          local.get 0
          local.get 2
          i32.add
          i32.load
          call 51
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
        end
        br 1 (;@1;)
      end
      local.get 0
      i32.load offset=4
      call 51
      local.set 1
    end
    local.get 1
    i32.const 1
    i32.add)
  (func (;52;) (type 2) (param i32) (result i32)
    (local i32 i32)
    global.get 0
    i32.const 16
    i32.sub
    local.tee 1
    global.set 0
    i32.const 4
    i32.const 16
    call 11
    local.tee 2
    i32.eqz
    if  ;; label = @1
      loop  ;; label = @2
        br 0 (;@2;)
      end
      unreachable
    end
    local.get 1
    local.get 0
    i32.load
    call 38
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
  (func (;53;) (type 4) (param i32 i32 i32)
    loop  ;; label = @1
      local.get 1
      if  ;; label = @2
        local.get 0
        local.get 2
        call 52
        i32.store
        local.get 1
        i32.const 1
        i32.sub
        local.set 1
        local.get 0
        i32.const 4
        i32.add
        local.set 0
        local.get 2
        i32.const 4
        i32.add
        local.set 2
        br 1 (;@1;)
      end
    end)
  (func (;54;) (type 4) (param i32 i32 i32)
    local.get 2
    if  ;; label = @1
      local.get 1
      local.get 2
      call 11
      local.set 1
    end
    local.get 0
    local.get 2
    i32.store offset=4
    local.get 0
    local.get 1
    i32.store)
  (func (;55;) (type 0) (param i32 i32)
    (local i32)
    i32.const 1
    local.get 1
    call 11
    local.set 2
    local.get 0
    local.get 1
    i32.store offset=4
    local.get 0
    local.get 2
    i32.store)
  (func (;56;) (type 3) (param i32 i32 i32 i32)
    (local i32 i32)
    global.get 0
    i32.const 16
    i32.sub
    local.tee 3
    global.set 0
    local.get 3
    local.get 1
    i32.load
    local.tee 5
    i32.load
    i32.store offset=12
    i32.const 1
    local.set 4
    i32.const 2048
    local.get 2
    i32.const 2
    i32.add
    local.tee 1
    local.get 1
    i32.mul
    local.tee 1
    local.get 1
    i32.const 2048
    i32.le_u
    select
    local.tee 2
    i32.const 4
    local.get 3
    i32.const 12
    i32.add
    i32.const 1
    i32.const 1
    i32.const 2
    call 59
    local.set 1
    local.get 5
    local.get 3
    i32.load offset=12
    i32.store
    local.get 1
    if  ;; label = @1
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
      local.set 4
    end
    local.get 0
    local.get 1
    i32.store offset=4
    local.get 0
    local.get 4
    i32.store
    local.get 3
    i32.const 16
    i32.add
    global.set 0)
  (func (;57;) (type 3) (param i32 i32 i32 i32)
    block (result i32)  ;; label = @1
      local.get 3
      i32.const 3
      i32.shl
      i32.const 16384
      i32.add
      local.tee 1
      local.get 2
      i32.const 2
      i32.shl
      local.tee 2
      local.get 1
      local.get 2
      i32.gt_u
      select
      i32.const 65543
      i32.add
      local.tee 1
      i32.const 16
      i32.shr_u
      memory.grow
      local.tee 2
      i32.const -1
      i32.eq
      if  ;; label = @2
        i32.const 0
        local.set 2
        i32.const 1
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
      local.get 1
      i32.const -65536
      i32.and
      i32.add
      i32.const 2
      i32.or
      i32.store
      i32.const 0
    end
    local.set 3
    local.get 0
    local.get 2
    i32.store offset=4
    local.get 0
    local.get 3
    i32.store)
  (func (;58;) (type 5) (param i32 i32) (result i32)
    i32.const 512)
  (func (;59;) (type 11) (param i32 i32 i32 i32 i32 i32) (result i32)
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
      call 60
      local.tee 7
      br_if 0 (;@1;)
      local.get 6
      i32.const 8
      i32.add
      local.get 3
      local.get 0
      local.get 1
      local.get 4
      call_indirect (type 3)
      i32.const 0
      local.set 7
      local.get 6
      i32.load offset=8
      i32.const 1
      i32.and
      br_if 0 (;@1;)
      local.get 6
      i32.load offset=12
      local.tee 4
      local.get 2
      i32.load
      i32.store offset=8
      local.get 2
      local.get 4
      i32.store
      local.get 0
      local.get 1
      local.get 2
      local.get 3
      local.get 5
      call 60
      local.set 7
    end
    local.get 6
    i32.const 16
    i32.add
    global.set 0
    local.get 7)
  (func (;60;) (type 12) (param i32 i32 i32 i32 i32) (result i32)
    (local i32 i32 i32 i32 i32 i32 i32)
    local.get 1
    i32.const 1
    i32.sub
    local.set 9
    i32.const 0
    local.get 1
    i32.sub
    local.set 10
    local.get 0
    i32.const 2
    i32.shl
    local.set 8
    local.get 2
    i32.load
    local.set 5
    loop  ;; label = @1
      block  ;; label = @2
        local.get 5
        i32.eqz
        br_if 0 (;@2;)
        local.get 5
        local.set 1
        loop  ;; label = @3
          block  ;; label = @4
            block  ;; label = @5
              block  ;; label = @6
                block (result i32)  ;; label = @7
                  block  ;; label = @8
                    local.get 1
                    i32.load offset=8
                    local.tee 5
                    i32.const 1
                    i32.and
                    i32.eqz
                    if  ;; label = @9
                      local.get 1
                      i32.load
                      i32.const -4
                      i32.and
                      local.tee 11
                      local.get 1
                      i32.const 8
                      i32.add
                      local.tee 6
                      i32.sub
                      local.get 8
                      i32.lt_u
                      br_if 3 (;@6;)
                      local.get 11
                      local.get 8
                      i32.sub
                      local.get 10
                      i32.and
                      local.tee 5
                      local.get 6
                      local.get 3
                      local.get 0
                      local.get 4
                      call_indirect (type 5)
                      i32.const 2
                      i32.shl
                      i32.add
                      i32.const 8
                      i32.add
                      i32.lt_u
                      if  ;; label = @10
                        local.get 6
                        i32.load
                        local.set 5
                        local.get 6
                        local.get 9
                        i32.and
                        br_if 4 (;@6;)
                        local.get 2
                        local.get 5
                        i32.const -4
                        i32.and
                        i32.store
                        local.get 1
                        local.tee 5
                        i32.load
                        br 3 (;@7;)
                      end
                      i32.const 0
                      local.set 2
                      local.get 5
                      i32.const 0
                      i32.store
                      local.get 5
                      i32.const 8
                      i32.sub
                      local.tee 5
                      i64.const 0
                      i64.store align=4
                      local.get 5
                      local.get 1
                      i32.load
                      i32.const -4
                      i32.and
                      i32.store
                      block  ;; label = @10
                        local.get 1
                        i32.load
                        local.tee 0
                        i32.const 2
                        i32.and
                        br_if 0 (;@10;)
                        local.get 0
                        i32.const -4
                        i32.and
                        local.tee 0
                        i32.eqz
                        br_if 0 (;@10;)
                        local.get 0
                        local.get 0
                        i32.load offset=4
                        i32.const 3
                        i32.and
                        local.get 5
                        i32.or
                        i32.store offset=4
                        local.get 5
                        i32.load offset=4
                        i32.const 3
                        i32.and
                        local.set 2
                      end
                      local.get 5
                      local.get 1
                      local.get 2
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
                      local.tee 0
                      i32.const 3
                      i32.and
                      local.get 5
                      i32.or
                      local.tee 2
                      i32.store
                      local.get 0
                      i32.const 2
                      i32.and
                      br_if 1 (;@8;)
                      local.get 5
                      i32.load
                      br 2 (;@7;)
                    end
                    local.get 1
                    local.get 5
                    i32.const -2
                    i32.and
                    i32.store offset=8
                    local.get 1
                    i32.load offset=4
                    i32.const -4
                    i32.and
                    local.tee 5
                    if (result i32)  ;; label = @9
                      i32.const 0
                      local.get 5
                      local.get 5
                      i32.load8_u
                      i32.const 1
                      i32.and
                      select
                    else
                      i32.const 0
                    end
                    local.set 5
                    local.get 1
                    call 61
                    local.get 1
                    i32.load8_u
                    i32.const 2
                    i32.and
                    br_if 3 (;@5;)
                    br 4 (;@4;)
                  end
                  local.get 1
                  local.get 2
                  i32.const -3
                  i32.and
                  i32.store
                  local.get 5
                  i32.load
                  i32.const 2
                  i32.or
                end
                local.set 2
                local.get 5
                local.get 2
                i32.const 1
                i32.or
                i32.store
                local.get 5
                i32.const 8
                i32.add
                local.set 7
                br 4 (;@2;)
              end
              local.get 2
              local.get 5
              i32.store
              br 4 (;@1;)
            end
            local.get 5
            local.get 5
            i32.load
            i32.const 2
            i32.or
            i32.store
          end
          local.get 2
          local.get 5
          i32.store
          local.get 5
          local.set 1
          br 0 (;@3;)
        end
        unreachable
      end
    end
    local.get 7)
  (func (;61;) (type 1) (param i32)
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
    local.get 0
    i32.load offset=4
    local.tee 2
    i32.const -4
    i32.and
    local.tee 3
    if  ;; label = @1
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
  (func (;62;) (type 2) (param i32) (result i32)
    i32.const 1)
  (func (;63;) (type 5) (param i32 i32) (result i32)
    local.get 1)
  (func (;64;) (type 2) (param i32) (result i32)
    i32.const 0)
  (func (;65;) (type 3) (param i32 i32 i32 i32)
    (local i32)
    local.get 0
    i32.const 0
    i32.store
    local.get 0
    i32.const 8
    i32.sub
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
          i32.const 4
          i32.sub
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
          call 61
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
  (export "call" (func 17))
  (export "__data_end" (global 1))
  (export "__heap_base" (global 2))
  (elem (;0;) (i32.const 1) func 57 58 56 63 62 64)
  (data (;0;) (i32.const 1048576) " index out of bounds: the len is \c0\12 but the index is \c0\00\12range start index \c0\22 out of range for slice of length \c0\00\10range end index \c0\22 out of range for slice of length \c0\00\c0\02: \c0\00/Users/mertk/.cargo/registry/src/index.crates.io-1949cf8c6b5b557f/casper-types-6.0.1/src/uint.rs\00client_deposit.rs\00/Users/mertk/.cargo/registry/src/index.crates.io-1949cf8c6b5b557f/casper-types-6.0.1/src/bytesrepr.rs\00/Users/mertk/.rustup/toolchains/nightly-aarch64-apple-darwin/lib/rustlib/src/rust/library/core/src/slice/mod.rs\00library/alloc/src/raw_vec/mod.rs\00/Users/mertk/.cargo/registry/src/index.crates.io-1949cf8c6b5b557f/byteorder-1.5.0/src/lib.rs\00&copy_from_slice: source slice length (\c0+) does not match destination slice length (\c0\01)\00contract_hashamountl2_address\00\00\00\0e\01\10\00\11\00\00\001\00\00\00\09\00\00\00pursedepositcapacity overflow\00\00\00\f6\01\10\00 \00\00\00\1c\00\00\00\05\00\00\00\86\01\10\00o\00\00\00\f1\03\00\00\1c\00\00\00\86\01\10\00o\00\00\00\f2\03\00\00\1c\00\00\00\86\01\10\00o\00\00\00\f6\03\00\00 \00\00\00\86\01\10\00o\00\00\00\f6\03\00\00+\00\00\00mid > len\00\00\00\ad\00\10\00`\00\00\00*\00\00\00\05\00\00\00assertion failed: 8 * 8 >= slice.len()\00\00\17\02\10\00\5c\00\00\00\7f\08\00\00\0c\00\00\00\17\02\10\00\5c\00\00\00\7f\08\00\00\12\00\00\00 \01\10\00e\00\00\00\91\01\00\00\10\00\00\00\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01\01")
  (data (;1;) (i32.const 1049762) "\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\02\03\03\03\03\03\03\03\03\03\03\03\03\03\03\03\03\04\04\04\04\04")
  (data (;2;) (i32.const 1049824) "\10\00\00\00\11\00\00\00\12\00\00\00\13\00\00\00'\00\00\00&"))
