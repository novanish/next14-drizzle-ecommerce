import Link from "next/link";
import { Button } from "@/components/ui/button";

type Props = React.ComponentProps<typeof Link>;

export function BackButton(props: Props) {
  return (
    <Button asChild variant={"link"} className="font-medium w-full">
      <Link {...props} />
    </Button>
  );
}
