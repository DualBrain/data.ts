﻿Imports System.Runtime.CompilerServices
Imports Microsoft.VisualBasic.ApplicationServices
Imports Microsoft.VisualBasic.CommandLine
Imports Microsoft.VisualBasic.Language
Imports Wasm.Symbols

''' <summary>
''' WebAssembly ``S-Expression`` compiler
''' </summary>
Public Module Wabt

    ReadOnly wat2wasm$ = App.ProductSharedDIR & "/wabt_bin/wat2wasm.exe"

    Sub New()
        If wat2wasm.FileExists Then
            Return
        End If

        ' Release compiler if not exists.
        With App.GetAppSysTempFile(".zip")
            Call My.Resources.wabt_1_0_10_win64.FlushStream(.ByRef)
            Call ZipLib.ImprovedExtractToDirectory(.ByRef, wat2wasm.ParentPath, Overwrite.Always)

            If Not wat2wasm.FileExists Then
                Throw New UnauthorizedAccessException($"Access Denied on filesystem location: {wat2wasm.ParentPath}")
            End If
        End With
    End Sub

    ''' <summary>
    ''' Compile VB.NET module parse result to webAssembly binary
    ''' </summary>
    ''' <param name="[module]"></param>
    ''' <returns>
    ''' This function returns the compiler standard output
    ''' </returns>
    <Extension>
    Public Function Compile([module] As ModuleSymbol, output$, Optional verbos As Boolean = True) As String
        With App.GetAppSysTempFile(".wast", App.PID)
            Call [module] _
                .ToSExpression _
                .SaveTo(.ByRef)

            With New IORedirectFile(wat2wasm, $"{ .CLIPath} {"" Or "-v".When(verbos)}")
                Call .Run()
                Return .StandardOutput
            End With
        End With
    End Function

    ''' <summary>
    ''' Compile wast file to wasm binary and then returns the compiler log.
    ''' </summary>
    ''' <param name="wast"></param>
    ''' <returns></returns>
    Public Function CompileWast(wast As String) As String

    End Function
End Module
