"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Download, FileUp, FileDown, Copy, Check } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { compressText, type HuffmanResult } from "@/lib/huffman"
import { saveAs, downloadFile } from "@/lib/file-utils"
import JSZip from "jszip"
import { Progress } from "@/components/ui/progress"

export default function CompressionTab() {
  const [inputText, setInputText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<HuffmanResult | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [progress, setProgress] = useState(0)
  const [copied, setCopied] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    if (selectedFile.size > 1024 * 1024) {
      setError("File size exceeds 1MB limit")
      return
    }

    if (selectedFile.type !== "text/plain" && !selectedFile.name.endsWith(".txt")) {
      setError("Only .txt files are supported")
      return
    }

    setFile(selectedFile)
    try {
      const text = await selectedFile.text()
      setInputText(text)
      setError(null)
    } catch (err) {
      setError("Failed to read file")
    }
  }

  const handleCompress = () => {
    if (!inputText.trim()) {
      setError("Please enter some text to compress")
      return
    }

    setIsLoading(true)
    setError(null)
    setProgress(0)

    try {
      // Simulate processing with progress
      const intervalId = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 10
          if (newProgress >= 100) {
            clearInterval(intervalId)
            return 100
          }
          return newProgress
        })
      }, 50)

      setTimeout(() => {
        const compressionResult = compressText(inputText)
        setResult(compressionResult)
        setIsLoading(false)
        clearInterval(intervalId)
        setProgress(100)
      }, 500)
    } catch (err) {
      setError("Compression failed. Please try again.")
      setIsLoading(false)
      setProgress(0)
    }
  }

  const downloadCompressedData = () => {
    if (!result) return

    // Try both methods to ensure download works
    const success = saveAs(result.compressedData, "compressed.bin", "application/octet-stream")

    if (!success) {
      downloadFile(result.compressedData, "compressed.bin", "application/octet-stream")
    }
  }

  const downloadCodeTable = () => {
    if (!result) return

    const jsonString = JSON.stringify(result.codeTable, null, 2)
    const success = saveAs(jsonString, "huffman-codes.json", "application/json")

    if (!success) {
      downloadFile(jsonString, "huffman-codes.json", "application/json")
    }
  }

  const downloadZip = async () => {
    if (!result) return

    try {
      const zip = new JSZip()
      zip.file("compressed.bin", result.compressedData)
      zip.file("huffman-codes.json", JSON.stringify(result.codeTable, null, 2))

      const content = await zip.generateAsync({ type: "blob" })
      const success = saveAs(content, "huffman-compression.zip", "application/zip")

      if (!success) {
        downloadFile(content, "huffman-compression.zip", "application/zip")
      }
    } catch (error) {
      console.error("Error creating zip file:", error)
      setError("Failed to create zip file. Please try again.")
    }
  }

  const copyToClipboard = () => {
    if (!result) return

    navigator.clipboard.writeText(result.compressedData).then(
      () => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      },
      () => {
        setError("Failed to copy to clipboard")
      },
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="input-text" className="text-base font-medium">
          Input Text
        </Label>
        <Textarea
          id="input-text"
          placeholder="Enter text to compress..."
          className="min-h-[150px] font-mono text-sm"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          {inputText.length} characters ({new TextEncoder().encode(inputText).length} bytes)
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="file-upload" className="text-base font-medium">
          Or upload a text file (max 1MB)
        </Label>
        <div className="flex items-center gap-2">
          <Input id="file-upload" type="file" accept=".txt" onChange={handleFileChange} className="flex-1" />
          <Button variant="outline" onClick={() => document.getElementById("file-upload")?.click()}>
            <FileUp className="h-4 w-4 mr-2" />
            Browse
          </Button>
        </div>
        {file && (
          <p className="text-sm text-muted-foreground">
            Selected file: {file.name} ({(file.size / 1024).toFixed(2)} KB)
          </p>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button onClick={handleCompress} disabled={isLoading || !inputText.trim()} className="w-full sm:w-auto">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Compressing...
          </>
        ) : (
          "Compress"
        )}
      </Button>

      {isLoading && (
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-center text-muted-foreground">Processing... {progress}%</p>
        </div>
      )}

      {result && (
        <Card className="mt-6 border-2 shadow-md">
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1 bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm font-medium">Original Size</p>
                  <p className="text-2xl font-bold">{result.originalSize} bits</p>
                  <p className="text-xs text-muted-foreground">({Math.ceil(result.originalSize / 8)} bytes)</p>
                </div>
                <div className="space-y-1 bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm font-medium">Compressed Size</p>
                  <p className="text-2xl font-bold">{result.compressedSize} bits</p>
                  <p className="text-xs text-muted-foreground">({Math.ceil(result.compressedSize / 8)} bytes)</p>
                </div>
                <div className="space-y-1 bg-primary/10 p-4 rounded-lg">
                  <p className="text-sm font-medium">Compression Ratio</p>
                  <p className="text-2xl font-bold">{result.compressionRatio.toFixed(2)}x</p>
                  <p className="text-xs text-muted-foreground">
                    ({((1 - 1 / result.compressionRatio) * 100).toFixed(1)}% reduction)
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="font-medium">Compressed Data</p>
                  <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
                <div className="max-h-[100px] overflow-y-auto border rounded-md p-3 bg-muted/30">
                  <p className="font-mono text-xs break-all">{result.compressedData}</p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="font-medium">Huffman Coding Table</p>
                <div className="max-h-[200px] overflow-y-auto border rounded-md p-2 bg-muted/30">
                  <table className="min-w-full">
                    <thead>
                      <tr>
                        <th className="text-left py-2 px-3 bg-muted sticky top-0">Character</th>
                        <th className="text-left py-2 px-3 bg-muted sticky top-0">Code</th>
                        <th className="text-left py-2 px-3 bg-muted sticky top-0">Frequency</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(result.codeTable).map(([char, { code, frequency }]) => (
                        <tr key={char} className="border-t hover:bg-muted/50">
                          <td className="py-2 px-3">{char === " " ? "Space" : char === "\n" ? "Newline" : char}</td>
                          <td className="py-2 px-3 font-mono">{code}</td>
                          <td className="py-2 px-3">{frequency}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <Button onClick={downloadCompressedData} variant="outline" className="flex-1 sm:flex-none">
                  <Download className="h-4 w-4 mr-2" />
                  Download Compressed Data
                </Button>
                <Button onClick={downloadCodeTable} variant="outline" className="flex-1 sm:flex-none">
                  <Download className="h-4 w-4 mr-2" />
                  Download Code Table
                </Button>
                <Button onClick={downloadZip} className="w-full sm:w-auto">
                  <FileDown className="h-4 w-4 mr-2" />
                  Download All as ZIP
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

