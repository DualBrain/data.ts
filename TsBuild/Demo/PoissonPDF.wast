(module ;; Module Math

    ;; Declare Function Exp Lib "Math" Alias "exp" (x As f64) As f64
(func $Exp (import "Math" "exp") (param $x f64) (result f64))
    
    

    (export "PoissonPDF" (func $PoissonPDF)) 

    (func $PoissonPDF (param $k i32) (param $lambda f64) (result f64)
        ;; Public Function PoissonPDF(k As i32, lambda As f64) As f64
        (local $result f64)
    (set_local $result (call $Exp (f64.sub (f64.const 0) (get_local $lambda))))
    ;; Start Do While Block block_9a020000
    
    (block $block_9a020000 
        (loop $loop_9b020000
    
                    (br_if $block_9a020000 (i32.eqz (i32.ge_s (get_local $k) (i32.const 1))))
            (set_local $result (f64.mul (get_local $result) (f64.div (get_local $lambda) (f64.convert_s/i32 (get_local $k)))))
            (set_local $k (i32.sub (get_local $k) (i32.const 1)))
            (br $loop_9b020000)
    
        )
    )
    ;; End Loop loop_9b020000
    (return (get_local $result))
    )

)