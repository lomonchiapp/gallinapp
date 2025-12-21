import { Button } from "@/components/ui/button"
import { Github, Twitter, Linkedin, Facebook } from "lucide-react"
import { cn } from "@/lib/utils"

interface SocialLink {
  name: string
  icon: React.ComponentType<{ className?: string }>
  href: string
}

interface SocialLinksProps {
  links?: SocialLink[]
  variant?: "default" | "minimal"
  className?: string
}

const defaultLinks: SocialLink[] = [
  {
    name: "Twitter",
    icon: Twitter,
    href: "#",
  },
  {
    name: "Github",
    icon: Github,
    href: "#",
  },
]

export function SocialLinks({
  links = defaultLinks,
  variant = "default",
  className,
}: SocialLinksProps) {
  const variantClasses = {
    default: "h-9 w-9 text-neutral-300 hover:text-white hover:bg-white/10",
    minimal: "h-8 w-8 text-neutral-400 hover:text-primary-500",
  }

  return (
    <div className={cn("flex gap-2", className)}>
      {links.map((link) => {
        const Icon = link.icon
        return (
          <Button
            key={link.name}
            variant="ghost"
            size="icon"
            className={variantClasses[variant]}
            asChild
          >
            <a href={link.href} aria-label={link.name}>
              <Icon className="h-4 w-4" />
            </a>
          </Button>
        )
      })}
    </div>
  )
}








