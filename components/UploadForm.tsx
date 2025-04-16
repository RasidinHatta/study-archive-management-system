import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'

const UploadForm = () => {
    return (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <Input placeholder="Document title" />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Textarea placeholder="Brief description of your document" />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Document</label>
                {/* <UploadButton
                    endpoint="documentUploader"
                    onClientUploadComplete={() => { }}
                    onUploadError={() => { }}
                    className="ut-button:bg-primary ut-button:text-primary-foreground ut-button:hover:bg-primary/90"
                /> */}
            </div>
            <Button type="submit" className="w-full">
                Publish Document
            </Button>
        </div>
    )
}

export default UploadForm