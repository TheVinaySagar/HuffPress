import { CheckCircle, FileText, FileArchive, Download, UploadCloud } from "lucide-react"

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background relative">
      <div className="absolute inset-0 bg-grid-primary/10 pointer-events-none" />
      <div className="relative max-w-6xl mx-auto py-20 px-6">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <div className="bg-accent/50 rounded-2xl p-8 mb-8">
            <h1 className="text-6xl font-extrabold text-foreground">
              HuffPress Features
            </h1>
            <p className="text-xl text-muted-foreground mt-6 max-w-3xl mx-auto leading-relaxed">
              Discover how <span className="text-primary font-semibold">HuffPress</span> makes{" "}
              <span className="text-primary font-semibold">text compression and decompression</span>{" "}
              fast, efficient, and seamless using Huffman coding.
            </p>
          </div>
        </section>

        {/* Features Grid */}
        <section className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
          <FeatureCard
            icon={<FileText className="h-12 w-12 text-primary" />}
            title="Text Input & File Upload"
            description="Paste your text directly or upload a file for compression. Supports TXT and CSV formats."
          />
          <FeatureCard
            icon={<FileArchive className="h-12 w-12 text-primary" />}
            title="Lossless Compression"
            description="Uses Huffman coding to efficiently compress text while maintaining 100% data integrity."
          />
          <FeatureCard
            icon={<Download className="h-12 w-12 text-primary" />}
            title="Download Compressed Files"
            description="Easily download the compressed text and Huffman encoding as a file for later use."
          />
          <FeatureCard
            icon={<UploadCloud className="h-12 w-12 text-primary" />}
            title="Decompression Support"
            description="Upload your compressed file or paste the encoded text to restore the original content."
          />
          <FeatureCard
            icon={<CheckCircle className="h-12 w-12 text-primary" />}
            title="Fast & Efficient"
            description="Optimized algorithms ensure quick compression and decompression, even for large files."
          />
        </section>
      </div>
    </div>
  )
}

/* Feature Card Component */
function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="group p-8 border border-border rounded-xl bg-card backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-accent">
      <div className="mb-6 transform transition-transform duration-300 group-hover:scale-110">{icon}</div>
      <h2 className="text-2xl font-bold text-card-foreground mb-3">{title}</h2>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  )
}
