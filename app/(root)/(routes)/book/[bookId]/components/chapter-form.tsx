"use client";

import ImageUpload from "@/components/image-upload";
import { Button } from "@/components/ui/button";
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
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Wand2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface ChapterFormProps {
  chapter?: {
    id: string;
    title: string;
    content: string;
    src?: string;
    order: number;
  } | null;
  bookId: string;
  bookTitle: string;
}

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  src: z.string().min(1, { message: "Image is required" }),
});

export const ChapterForm = ({
  chapter,
  bookId,
  bookTitle,
}: ChapterFormProps) => {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  const order = searchParams?.get("order") || chapter?.order;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: chapter || {
      title: "",
      content: "",
      src: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      if (chapter) {
        await axios.patch(`/api/book/${bookId}/chapter/${chapter.id}`, data);
      } else {
        await axios.post(`/api/book/${bookId}/chapter/new`, data);
      }

      toast({
        description: chapter
          ? "Chapter updated successfully."
          : "Chapter created successfully.",
        duration: 3000,
      });

      router.refresh();
      router.push(`/book/${bookId}`);
    } catch {
      toast({
        variant: "destructive",
        description: "Something went wrong",
        duration: 3000,
      });
    }
  };

  return (
    <div className="h-full p-4 space-y-2 max-w-3xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pb-4">
          <div className="space-y-2 w-full">
            <div className="text-lg font-medium">
              <h3>Chapter {order}</h3>
              <p className="text-sm text-muted-foreground">
                Details about chapter {order} of the book "{bookTitle}".
              </p>
            </div>
            <Separator className="bg-primary/10" />
          </div>
          <FormField
            name="title"
            control={form.control}
            render={({ field }) => (
              <FormItem className="col-span-2 md:col-span-1">
                <FormLabel>Chapter Title</FormLabel>
                <FormControl>
                  <Input
                    disabled={isLoading}
                    placeholder="Wolf of Akclanta"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Title for your chapter.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="src"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center justify-center space-y-4">
                <FormControl>
                  <ImageUpload
                    disabled={isLoading}
                    onChange={field.onChange}
                    value={String(field.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="space-y-2 w-full">
            <FormField
              name="content"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-1">
                  <FormLabel>Chapter text in JSON format</FormLabel>
                  <FormControl>
                    <Textarea
                      className="bg-background resize-none"
                      rows={30}
                      disabled={isLoading}
                      placeholder="Deaths and mystery in a remote village."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    JSON format for your chapter content.
                  </FormDescription>
                </FormItem>
              )}
            />
          </div>
          <div className="w-full flex justify-center">
            <Button size="lg" disabled={isLoading}>
              {chapter ? "Update Chapter" : "Create Chapter"}
              <Wand2 className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
