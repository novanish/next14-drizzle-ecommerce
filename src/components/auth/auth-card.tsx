import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BackButton } from "./back-button";
import { Socials } from "./socials";

type Props =
  | {
      children: React.ReactNode;
      cardTitle: string;
      showSocialLogin?: boolean;
    } & (
      | {
          backButtonHref: string;
          backButtonText: string;
        }
      | {
          backButtonHref?: undefined;
          backButtonText?: undefined;
        }
    );

export function AuthCard({
  children,
  cardTitle,
  backButtonHref,
  backButtonText,
  showSocialLogin,
}: Props) {
  return (
    <Card className="max-w-md shadow-sm mx-auto">
      <CardHeader>
        <CardTitle className="text-primary">{cardTitle}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
      {showSocialLogin ? (
        <CardFooter>
          <Socials />
        </CardFooter>
      ) : null}
      {backButtonHref ? (
        <CardFooter>
          <BackButton href={backButtonHref}>{backButtonText}</BackButton>
        </CardFooter>
      ) : null}
    </Card>
  );
}
