"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Download, FileUp, Copy, Check } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { decompressText, type CodeTable } from "@/lib/huffman"
import { saveAs, downloadFile } from "@/lib/file-utils"
import JSZip from "jszip"
import { Progress } from "@/components/ui/progress"

export default function DecompressionTab() {
  const [compressedData, setCompressedData] = useState("")
  const [codeTableJson, setCodeTableJson] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [decompressedText, setDecompressedText] = useState<string | null>(null)
  const [zipFile, setZipFile] = useState<File | null>(null)
  const [progress, setProgress] = useState(0)
  const [copied, setCopied] = useState(false)

  const handleCompressedDataChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCompressedData(e.target.value)
  }

  const handleCodeTableChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCodeTableJson(e.target.value)
  }

  const handleZipFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    if (!selectedFile.name.endsWith(".zip")) {
      setError("Please select a .zip file")
      return
    }

    setZipFile(selectedFile)
    setError(null)
    setProgress(0)

    try {
      // Show progress while loading
      setIsLoading(true)
      const intervalId = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90))
      }, 50)

      const zip = new JSZip()
      const contents = await zip.loadAsync(selectedFile)

      // Extract compressed data
      const compressedFile = contents.file("compressed.bin")
      if (compressedFile) {
        const data = await compressedFile.async("text")
        setCompressedData(data)
      }

      // Extract code table
      const codeTableFile = contents.file("huffman-codes.json")
      if (codeTableFile) {
        const data = await codeTableFile.async("text")
        setCodeTableJson(data)
      }

      if (!compressedFile || !codeTableFile) {
        setError("The ZIP file does not contain the required files")
      }

      clearInterval(intervalId)
      setProgress(100)
      setIsLoading(false)
    } catch (err) {
      setError("Failed to read ZIP file")
      setIsLoading(false)
      setProgress(0)
    }
  }

  const handleDecompress = () => {
    if (!compressedData.trim()) {
      setError("Please enter compressed data")
      return
    }

    if (!codeTableJson.trim()) {
      setError("Please enter Huffman code table")
      return
    }

    setIsLoading(true)
    setError(null)
    setProgress(0)

    try {
      let codeTable: CodeTable
      try {
        codeTable = JSON.parse(codeTableJson)
      } catch (err) {
        throw new Error("Invalid JSON format for code table")
      }

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
        const result = decompressText(compressedData, codeTable)
        setDecompressedText(result)
        setIsLoading(false)
        clearInterval(intervalId)
        setProgress(100)
      }, 500)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Decompression failed. Please try again.")
      setIsLoading(false)
      setProgress(0)
    }
  }

  const downloadDecompressedText = () => {
    if (!decompressedText) return

    // Try both methods to ensure download works
    const success = saveAs(decompressedText, "decompressed.txt", "text/plain;charset=utf-8")

    if (!success) {
      downloadFile(decompressedText, "decompressed.txt", "text/plain;charset=utf-8")
    }
  }

  const copyToClipboard = () => {
    if (!decompressedText) return

    navigator.clipboard.writeText(decompressedText).then(
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
        <Label htmlFor="compressed-data" className="text-base font-medium">
          Compressed Data
        </Label>
        <Textarea
          id="compressed-data"
          placeholder="Enter compressed binary data..."
          className="min-h-[100px] font-mono text-sm"
          value={compressedData}
          onChange={handleCompressedDataChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="code-table" className="text-base font-medium">
          Huffman Code Table (JSON format)
        </Label>
        <Textarea
          id="code-table"
          placeholder="Enter Huffman code table in JSON format..."
          className="min-h-[100px] font-mono text-sm"
          value={codeTableJson}
          onChange={handleCodeTableChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="zip-upload" className="text-base font-medium">
          Or upload a ZIP file containing both files
        </Label>
        <div className="flex items-center gap-2">
          <Input id="zip-upload" type="file" accept=".zip" onChange={handleZipFileChange} className="flex-1" />
          <Button variant="outline" onClick={() => document.getElementById("zip-upload")?.click()}>
            <FileUp className="h-4 w-4 mr-2" />
            Browse
          </Button>
        </div>
        {zipFile && (
          <p className="text-sm text-muted-foreground">
            Selected file: {zipFile.name} ({(zipFile.size / 1024).toFixed(2)} KB)
          </p>
        )}
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading && zipFile && (
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-center text-muted-foreground">Processing ZIP file... {progress}%</p>
        </div>
      )}

      <Button
        onClick={handleDecompress}
        disabled={isLoading || !compressedData.trim() || !codeTableJson.trim()}
        className="w-full sm:w-auto"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Decompressing...
          </>
        ) : (
          "Decompress"
        )}
      </Button>

      {isLoading && !zipFile && (
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-center text-muted-foreground">Decompressing... {progress}%</p>
        </div>
      )}

      {decompressedText && (
        <Card className="mt-6 border-2 shadow-md">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="font-medium">Decompressed Text</p>
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
              <div className="max-h-[300px] overflow-y-auto border rounded-md p-4 whitespace-pre-wrap bg-muted/30">
                {decompressedText}
              </div>

              <div className="pt-2">
                <Button onClick={downloadDecompressedText} className="w-full sm:w-auto">
                  <Download className="h-4 w-4 mr-2" />
                  Download Decompressed Text
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

