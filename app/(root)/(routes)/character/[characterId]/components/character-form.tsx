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
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category, Character } from "@prisma/client";
import axios from "axios";
import { Wand2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface CharacterFormProps {
  initialData: Character | null;
  categories: Category[];
}

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  class: z.string().min(1, { message: "Class is required" }),
  species: z.string().min(1, { message: "Species is required" }),
  background: z.string().min(1, { message: "Background is required" }),
  level: z.string().min(1, { message: "Level min is required" }).max(20),
  armorClass: z.string().min(1, { message: "Armor class is required" }),
  src: z.string().min(1, { message: "Image is required" }),
  initiative: z.string().min(-10, { message: "Initiative is required" }),
  hitPoints: z.string().min(1, { message: "Hit Points are required" }),
  strength: z.string().min(1, { message: "Strength is required" }),
  dexterity: z.string().min(1, { message: "Dexterity is required" }),
  constitution: z.string().min(1, { message: "Constitution is required" }),
  intelligence: z.string().min(1, { message: "Intelligence is required" }),
  wisdom: z.string().min(1, { message: "Wisdom is required" }),
  charisma: z.string().min(1, { message: "Charisma is required" }),
  speed: z.string().min(1, { message: "Speed is required" }),
  senses: z.string().min(1, { message: "Senses are required" }),
  languages: z.string().min(1, { message: "Languages are required" }),
  skills: z.string().min(1, { message: "Skills are required" }),
  traits: z.string().min(1, { message: "Traits are required" }),
  actions: z.string().min(1, { message: "Actions are required" }),
  categoryId: z.string().min(1, { message: "Category is required" }),
});

export const CharacterForm = ({
  categories,
  initialData,
}: CharacterFormProps) => {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          level: String(initialData.level),
          armorClass: String(initialData.armorClass),
          initiative: String(initialData.initiative),
          hitPoints: String(initialData.hitPoints),
          strength: String(initialData.strength),
          dexterity: String(initialData.dexterity),
          constitution: String(initialData.constitution),
          intelligence: String(initialData.intelligence),
          wisdom: String(initialData.wisdom),
          charisma: String(initialData.charisma),
          speed: String(initialData.speed),
          senses: String(initialData.senses),
          languages: String(initialData.languages),
          skills: String(initialData.skills),
          traits: String(initialData.traits),
          actions: String(initialData.actions),
        }
      : {
          name: "",
          class: "",
          species: "",
          background: "",
          src: "",
          categoryId: "character",
        },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (initialData) {
        await axios.patch(`/api/character/${initialData.id}`, values);
      } else {
        await axios.post("/api/character", values);
      }

      toast({
        description: "Character created successfully.",
        duration: 3000,
      });

      router.refresh();
      router.push("/");
    } catch (error) {
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
              <h3>General Information</h3>
              <p className="text-sm text-muted-foreground">
                General information about your character
              </p>
            </div>
            <Separator className="bg-primary/10" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid grid-cols-1 gap-4 order-2 md:order-2">
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="col-span-2 md:col-span-1">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="Your character's name"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This is how your character will be named.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="class"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="col-span-2 md:col-span-1">
                    <FormLabel>Class</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="Rogue."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Define your character's class.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="species"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="col-span-2 md:col-span-1">
                    <FormLabel>Species</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="Human."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Define your character's species.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="background"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="col-span-2 md:col-span-1">
                    <FormLabel>Background</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="Acolyte."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Define your character's background.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col items-center justify-center space-y-4 order-1 md:order-2">
              <FormField
                name="src"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center justify-center space-y-4">
                    <FormControl>
                      <ImageUpload
                        disabled={isLoading}
                        onChange={field.onChange}
                        value={String(field.value)}
                        width="300px"
                        height="400px"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 order-2 md:order-3 md:col-span-2">
              <div>
                <FormField
                  name="level"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="col-span-2 md:col-span-1">
                      <FormLabel>Level</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          placeholder="1 - 20"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  name="armorClass"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="col-span-2 md:col-span-1">
                      <FormLabel>Armor Class</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          placeholder="AC 10 +"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  name="initiative"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="col-span-2 md:col-span-1">
                      <FormLabel>Initiative</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          placeholder="Dex +"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  name="hitPoints"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="col-span-2 md:col-span-1">
                      <FormLabel>Hit Points</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          placeholder="HP"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  name="strength"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="col-span-2 md:col-span-1">
                      <FormLabel>Strength</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          placeholder="Str"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  name="dexterity"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="col-span-2 md:col-span-1">
                      <FormLabel>Dexterity</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          placeholder="Dex"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  name="constitution"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="col-span-2 md:col-span-1">
                      <FormLabel>Constitution</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          placeholder="Con"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  name="intelligence"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="col-span-2 md:col-span-1">
                      <FormLabel>Intelligence</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          placeholder="Int"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  name="wisdom"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="col-span-2 md:col-span-1">
                      <FormLabel>Wisdom</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          placeholder="Wis"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  name="charisma"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="col-span-2 md:col-span-1">
                      <FormLabel>Charisma</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          placeholder="Cha"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  name="speed"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="col-span-2 md:col-span-1">
                      <FormLabel>Speed</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          placeholder="Speed"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  name="senses"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="col-span-2 md:col-span-1">
                      <FormLabel>Senses</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          placeholder="Sense"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  name="languages"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="col-span-2 md:col-span-1">
                      <FormLabel>Languages</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          placeholder="Languages"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  name="skills"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="col-span-2 md:col-span-1">
                      <FormLabel>Skills</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          placeholder="Skill"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  name="traits"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="col-span-2 md:col-span-1">
                      <FormLabel>Traits</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          placeholder="Traits"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  name="actions"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="col-span-2 md:col-span-1">
                      <FormLabel>Actions</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          placeholder="Actions"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
          <div className="w-full flex justify-center">
            <Button size="lg" disabled={isLoading}>
              {initialData
                ? "Edit General Information"
                : "Create your character"}
              <Wand2 className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
