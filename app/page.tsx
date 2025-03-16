"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import CompressionTab from "@/components/compression-tab"
import DecompressionTab from "@/components/decompression-tab"
import { Info } from "lucide-react"

export default function Home() {
  return (
    <Card className="border-2 shadow-md">
      <CardHeader className="bg-muted/30">
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5 text-primary" />
          Text Compression Tool
        </CardTitle>
        <CardDescription className="text-base">
          Huffman coding is a lossless data compression algorithm that assigns variable-length codes to input
          characters, with shorter codes for more frequent characters.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Tabs defaultValue="compress" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="compress">Compression</TabsTrigger>
            <TabsTrigger value="decompress">Decompression</TabsTrigger>
          </TabsList>
          <TabsContent value="compress">
            <CompressionTab />
          </TabsContent>
          <TabsContent value="decompress">
            <DecompressionTab />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
