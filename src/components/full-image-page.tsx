/* eslint-disable @next/next/no-img-element */
import { clerkClient } from "@clerk/nextjs/server";
import { deleteImage, getImage } from "~/server/queries";
import Image from "next/image";

export default async function FullPageImageView(props: { id: number }) {
  const image = await getImage(props.id);
  const client = await clerkClient();
  const uploaderInfo = await client.users.getUser(image.userId);

  return (
    <div className="flex flex-col p-8 md:flex-row md:space-x-5 md:px-16">
      <div className="flex flex-1 items-center justify-center rounded-lg border bg-card/70 backdrop-blur-xl dark:bg-card/50 md:aspect-video">
        <img src={image.url} className="max-h-full" alt={image.name} />
      </div>
      <div className="flex w-full flex-shrink-0 flex-col rounded-lg border bg-card/85 backdrop-blur-2xl dark:bg-card/50 md:w-80">
        <div className="border-b p-4">
          <h2 className="text-center text-xl font-semibold first-letter:capitalize">
            {image.name}
          </h2>
        </div>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="space-y-3">
            <span className="text-sm text-muted-foreground">Uploaded By</span>
            <div className="flex items-center gap-2">
              <Image
                src={uploaderInfo.imageUrl}
                alt="user picture"
                className="rounded-full"
                width={80}
                height={80}
              />
              <p className="font-medium">
                {uploaderInfo.fullName + " "}{" "}
                <span className="block text-sm text-muted-foreground">
                  @{uploaderInfo.username}
                </span>
              </p>
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-sm text-muted-foreground">Created On</span>
            <p className="font-medium">
              {new Date(image.createdAt).toLocaleDateString("en", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="mt-auto space-y-4">
            <button className="w-full rounded-lg bg-card/70 p-4 text-blue-500 hover:underline">
              Edit
            </button>
            <form
              action={async () => {
                "use server";
                await deleteImage(image.id);
              }}
            >
              <button
                type="submit"
                className="w-full rounded-lg bg-card/70 p-4 text-red-500 hover:underline"
              >
                Delete
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
