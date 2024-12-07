"use client";

import UserAvatar from "@/components/navigation/user-avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { UploadButton } from "@/lib/uploadthing";
import { settings } from "@/server/actions/settings";
import { settingSchema, SettingSchema } from "@/types/settings-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Session } from "next-auth";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";

interface Props {
  session: Session;
}

export function SettingCard({ session }: Props) {
  const { toast } = useToast();
  const form = useForm<SettingSchema>({
    resolver: zodResolver(settingSchema),
    defaultValues: {
      name: session.user?.name ?? "",
      image: session.user?.image ?? "",
      twoFactorEnabled: session.user?.twoFactorEnabled ?? session.user.isOAuth,
    },
  });

  const { execute, isPending } = useAction(settings, {
    onSuccess({ data }) {
      if (!data) return;

      if (data?.error) {
        return toast({
          variant: "destructive",
          description: data.error,
        });
      }

      toast({
        description: data.message,
      });
    },
  });

  function onSubmit(data: SettingSchema) {
    execute(data);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-primary">Account Settings</CardTitle>
        <CardDescription>Update your account settings here.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 max-w-sm"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <AvatarUploader session={session} form={form} />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormDescription>
                    This is your public profile image.
                  </FormDescription>
                  <FormControl>
                    <Input type="url" placeholder="Image" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="twoFactorEnabled"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Two Factor Authentication</FormLabel>
                  <FormDescription>
                    Enable two factor authentication
                  </FormDescription>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(checked) =>
                        form.setValue("twoFactorEnabled", checked)
                      }
                      disabled={session.user.isOAuth}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isPending}>
              Save
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

interface AvatarUploaderProps {
  session: Session;
  form: UseFormReturn<SettingSchema>;
}

function AvatarUploader({ session, form }: AvatarUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);

  return (
    <FormField
      control={form.control}
      name="image"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Avatar</FormLabel>
          <div className="flex items-center gap-4">
            <UserAvatar image={field.value} name={session.user.name} />

            <UploadButton
              disabled={isUploading}
              className="scale-75 ut-button:ring-primary  ut-label:bg-red-50  ut-button:bg-primary/75  hover:ut-button:bg-primary/100 ut:button:transition-all ut-button:duration-500  ut-label:hidden ut-allowed-content:hidden"
              endpoint="avatarUploader"
              onUploadBegin={() => {
                setIsUploading(true);
              }}
              onUploadError={(error) => {
                form.setError("image", {
                  type: "validate",
                  message: error.message,
                });

                setIsUploading(false);
              }}
              onClientUploadComplete={(res) => {
                form.setValue("image", res[0].url!);
                setIsUploading(false);
              }}
              content={{
                button({ ready }) {
                  return ready ? "Change Avatar" : "Getting Ready";
                },
              }}
            />
          </div>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
