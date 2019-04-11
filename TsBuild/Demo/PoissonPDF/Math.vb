﻿Public Module Math

    ''' <summary>
    ''' Imports external javascript function with declares
    ''' </summary>
    ''' <param name="x"></param>
    ''' <returns></returns>
    Declare Function Exp Lib "Math" Alias "exp" (x As Double) As Double
    Declare Function Random Lib "Math" Alias "random" () As Double

    ''' <summary>
    ''' Returns the PDF value at <paramref name="k"/> for the specified Poisson distribution.
    ''' </summary>
    ''' <remarks>
    ''' This public method will be export from this module in WebAssembly
    ''' </remarks>
    Public Function PoissonPDF(k%, lambda As Double) As Double
        Dim result As Double = Exp(-lambda)

        While k >= 1
            result *= lambda / k
            k -= 1
        End While

        Return result
    End Function

    Public Function Add10(x As Integer) As Integer
        For i As Integer = 0 To 9
            x += 1
        Next

        Return x
    End Function

    Public Function FlipCoin() As Double
        Dim r As Double = Random()

        If r >= 0.5 Then
            Return 1 + r
        Else
            Return -1 - r
        End If
    End Function
End Module
