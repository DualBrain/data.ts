﻿Imports System.Xml.Serialization
Imports Microsoft.VisualBasic.ComponentModel.Ranges.Model

Public Enum TypeScriptTokens
    undefined = 0
    [declare]
    keyword
    [function]
    functionName
    functionCalls
    identifier
    typeName
    funcType
    comment
    constructor
    [operator]
    openStack
    ''' <summary>
    ''' 是一个字符串常量表达式
    ''' </summary>
    [string]
    closeStack
End Enum

<XmlType("token")> Public Class Token

    <XmlAttribute("type")> Public Property type As TypeScriptTokens
    <XmlText> Public Property text As String

    <XmlAttribute> Public Property start As Integer
    <XmlAttribute> Public Property ends As Integer

    Public Overrides Function ToString() As String
        Return $"[{type}] {text}"
    End Function

End Class

Public Class Escapes

    Public Property SingleLineComment As Boolean
    Public Property BlockTextComment As Boolean
    Public Property StringContent As Boolean

End Class

Public Class JavaScriptEscapes : Inherits Escapes
    Public Property StringStackSymbol As Char
End Class