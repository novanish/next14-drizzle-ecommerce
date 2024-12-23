import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

interface Props {
  image?: string | null;
  name?: string | null;
}

export default function UserAvatar({ image, name = "F" }: Props) {
  const fallback = name?.charAt(0).toUpperCase();

  return (
    <Avatar className="h-9 w-9">
      {image ? (
        <AvatarImage src={image} alt={name || "User Avatar"} asChild>
          <Image
            src={image}
            alt={name || "User Avatar"}
            width={28}
            height={28}
          />
        </AvatarImage>
      ) : null}
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  );
}
