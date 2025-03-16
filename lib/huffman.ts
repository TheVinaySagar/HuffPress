// Define types for our Huffman coding implementation
export type CodeTableEntry = {
  code: string
  frequency: number
}

export type CodeTable = {
  [char: string]: CodeTableEntry
}

export type HuffmanNode = {
  char?: string
  frequency: number
  left?: HuffmanNode
  right?: HuffmanNode
}

export type HuffmanResult = {
  compressedData: string
  codeTable: CodeTable
  originalSize: number
  compressedSize: number
  compressionRatio: number
}

// Build frequency table from input text
function buildFrequencyTable(text: string): Map<string, number> {
  const frequencyMap = new Map<string, number>()

  for (const char of text) {
    const count = frequencyMap.get(char) || 0
    frequencyMap.set(char, count + 1)
  }

  return frequencyMap
}

// Build Huffman tree from frequency table
function buildHuffmanTree(frequencyMap: Map<string, number>): HuffmanNode {
  // Create leaf nodes for each character
  const nodes: HuffmanNode[] = []

  frequencyMap.forEach((frequency, char) => {
    nodes.push({ char, frequency })
  })

  // Build the tree by combining nodes
  while (nodes.length > 1) {
    // Sort nodes by frequency (ascending)
    nodes.sort((a, b) => a.frequency - b.frequency)

    // Take the two nodes with lowest frequencies
    const left = nodes.shift()!
    const right = nodes.shift()!

    // Create a new internal node with these two as children
    const parent: HuffmanNode = {
      frequency: left.frequency + right.frequency,
      left,
      right,
    }

    // Add the new node back to the queue
    nodes.push(parent)
  }

  // Return the root of the Huffman tree
  return nodes[0]
}

// Generate code table from Huffman tree
function generateCodeTable(root: HuffmanNode): CodeTable {
  const codeTable: CodeTable = {}

  function traverse(node: HuffmanNode, code: string) {
    // If this is a leaf node (has a character)
    if (node.char !== undefined) {
      codeTable[node.char] = {
        code,
        frequency: node.frequency,
      }
      return
    }

    // Traverse left (add 0)
    if (node.left) {
      traverse(node.left, code + "0")
    }

    // Traverse right (add 1)
    if (node.right) {
      traverse(node.right, code + "1")
    }
  }

  // Start traversal from root with empty code
  traverse(root, "")

  return codeTable
}

// Compress text using Huffman coding
export function compressText(text: string): HuffmanResult {
  if (!text) {
    throw new Error("Input text cannot be empty")
  }

  // Build frequency table
  const frequencyMap = buildFrequencyTable(text)

  // Build Huffman tree
  const tree = buildHuffmanTree(frequencyMap)

  // Generate code table
  const codeTable = generateCodeTable(tree)

  // Encode the text
  let compressedData = ""
  for (const char of text) {
    compressedData += codeTable[char].code
  }

  // Calculate compression statistics
  const originalSize = text.length * 8 // Assuming 8 bits per character
  const compressedSize = compressedData.length
  const compressionRatio = originalSize / compressedSize

  return {
    compressedData,
    codeTable,
    originalSize,
    compressedSize,
    compressionRatio,
  }
}

// Decompress text using Huffman coding
export function decompressText(compressedData: string, codeTable: CodeTable): string {
  if (!compressedData) {
    throw new Error("Compressed data cannot be empty")
  }

  if (!codeTable || Object.keys(codeTable).length === 0) {
    throw new Error("Code table cannot be empty")
  }

  // Create a reverse lookup table (code -> char)
  const reverseLookup: { [code: string]: string } = {}
  for (const [char, entry] of Object.entries(codeTable)) {
    reverseLookup[entry.code] = char
  }

  let decompressedText = ""
  let currentCode = ""

  // Decode the compressed data
  for (const bit of compressedData) {
    if (bit !== "0" && bit !== "1") {
      throw new Error("Compressed data must contain only 0s and 1s")
    }

    currentCode += bit

    // Check if current code matches any in our table
    if (reverseLookup[currentCode]) {
      decompressedText += reverseLookup[currentCode]
      currentCode = ""
    }
  }

  // If we have bits left that don't match any code, the data might be corrupted
  if (currentCode.length > 0) {
    throw new Error("Invalid compressed data or code table")
  }

  return decompressedText
}

