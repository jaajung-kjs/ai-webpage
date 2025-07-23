"use client"

interface PhotoGalleryProps {
  files: Array<{
    id: string
    file_url: string
    file_name: string
    file_type: string
  }>
}

export function PhotoGallery({ files }: PhotoGalleryProps) {
  const imageFiles = files.filter(file => file.file_type?.startsWith("image/"))

  if (imageFiles.length === 0) return null

  return (
    <div className="mt-6 pt-6 border-t">
      <h3 className="text-sm font-medium mb-3">사진</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {imageFiles.map((file) => (
          <div 
            key={file.id} 
            className="relative aspect-square rounded-lg overflow-hidden bg-muted cursor-pointer group"
            onClick={() => window.open(file.file_url, '_blank')}
          >
            <img
              src={file.file_url}
              alt={file.file_name}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
          </div>
        ))}
      </div>
    </div>
  )
}