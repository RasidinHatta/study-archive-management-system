import { CardTitle, CardDescription } from "@/components/ui/card"

interface Props {
  title: string
  description: string
}

const DocumentCardHeader = ({ title, description }: Props) => {
  return (
    <div className="space-y-2">
          <CardTitle className="truncate">{title}</CardTitle>
          <CardDescription className="line-clamp-2">
            {description || "No description provided."}
          </CardDescription>
    </div>
  )
}

export default DocumentCardHeader