﻿#Region "Microsoft.VisualBasic::3d11428974e288587425455bf4bf29f6, Symbols\ModuleSymbol.vb"

    ' Author:
    ' 
    '       xieguigang (I@xieguigang.me)
    '       asuka (evia@lilithaf.me)
    ' 
    ' Copyright (c) 2019 GCModeller Cloud Platform
    ' 
    ' 
    ' MIT License
    ' 
    ' 
    ' Permission is hereby granted, free of charge, to any person obtaining a copy
    ' of this software and associated documentation files (the "Software"), to deal
    ' in the Software without restriction, including without limitation the rights
    ' to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    ' copies of the Software, and to permit persons to whom the Software is
    ' furnished to do so, subject to the following conditions:
    ' 
    ' The above copyright notice and this permission notice shall be included in all
    ' copies or substantial portions of the Software.
    ' 
    ' THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    ' IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    ' FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    ' AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    ' LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    ' OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    ' SOFTWARE.



    ' /********************************************************************************/

    ' Summaries:

    '     Class ModuleSymbol
    ' 
    '         Properties: [Imports], Exports, Globals, InternalFunctions, LabelName
    '                     Memory
    ' 
    '         Function: CreateModule, GenericEnumerator, GetEnumerator, ToSExpression, TypeInfer
    ' 
    ' 
    ' /********************************************************************************/

#End Region

Imports System.Runtime.CompilerServices
Imports Microsoft.VisualBasic.Linq
Imports Wasm.Symbols.Parser

Namespace Symbols

    Public Class ModuleSymbol : Inherits Expression
        Implements Enumeration(Of Expression)

        Public Property InternalFunctions As FuncSymbol()
        Public Property Exports As ExportSymbolExpression()
        Public Property [Imports] As ImportSymbol()
        Public Property Globals As DeclareGlobal()
        Public Property Memory As Memory

        ''' <summary>
        ''' The module name label
        ''' </summary>
        ''' <returns></returns>
        Public Property LabelName As String

        Public Iterator Function GenericEnumerator() As IEnumerator(Of Expression) Implements Enumeration(Of Expression).GenericEnumerator
            For Each func As FuncSymbol In InternalFunctions
                Yield func
            Next
        End Function

        Public Iterator Function GetEnumerator() As IEnumerator Implements Enumeration(Of Expression).GetEnumerator
            Yield GenericEnumerator()
        End Function

        <MethodImpl(MethodImplOptions.AggressiveInlining)>
        Public Overrides Function ToSExpression() As String
            Return ModuleBuilder.ToSExpression(Me)
        End Function

        <MethodImpl(MethodImplOptions.AggressiveInlining)>
        Public Overrides Function TypeInfer(symbolTable As SymbolTable) As String
            Return "any"
        End Function

        <MethodImpl(MethodImplOptions.AggressiveInlining)>
        Public Shared Function CreateModule(vbcode As String) As ModuleSymbol
            Return ModuleParser.CreateModule(vbcode)
        End Function

        Public Function Join(part As ModuleSymbol) As ModuleSymbol
            Return Me
        End Function
    End Class
End Namespace
