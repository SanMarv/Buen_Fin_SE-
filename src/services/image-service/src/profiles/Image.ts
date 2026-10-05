import { Style, Avatar } from "@dicebear/core";
import definition from "@dicebear/styles/initials.json" with { type: "json" };
import { COLORS, TEXT_COLOR } from "./profilesPallet.ts";
import { env } from "@env";
import sharp, { type SharpInput } from "sharp";
import heic from "heic-convert";
import { isHeic } from "@images/utils.js";

type Props = {
  user: { name: string; id: string };
  image?: null | Buffer;
};
type ProfilePicture = {
  file: Buffer;
  mimeType: "image/svg" | "image/webp";
  filename: string;
};
export class ProfileImage {
  public user: Props["user"];
  public image: Props["image"];
  private filename: string;
  constructor({ user, image = null }: Props) {
    this.user = user;
    this.image = image;
    this.user.name = this.user.name || "no_name";
    this.filename = `${user.name}.${image ? "webp" : "svg"}`;
  }
  private generateFallback() {
    const style = new Style(definition);
    const avatar = new Avatar(style, {
      backgroundColor: COLORS,
      textColor: TEXT_COLOR,
      seed: this.user.name || "Empty",
      size: env.IMAGE_PROFILE_SIZE,
      fontFamily: "Roboto",
    });
    return Buffer.from(avatar.toString(), "utf-8");
  }
  private async convertImage() {
    if (this.image === null || typeof this.image === "undefined")
      throw new Error("Trying to convert an image that is empty");

    let image: SharpInput = this.image;
    const { format, mediaType } = await sharp(image).metadata();
    const mimeType = mediaType ?? `image/${format}`;
    if (isHeic(mimeType)) image = await heic({ buffer: image, format: "PNG" });
    return await sharp(image)
      .resize({
        width: env.IMAGE_PROFILE_SIZE,
        height: env.IMAGE_PROFILE_SIZE,
        fit: "cover",
      })
      .webp()
      .toBuffer();
  }
  async process(): Promise<ProfilePicture> {
    if (this.image === null)
      return {
        file: this.generateFallback(),
        mimeType: "image/svg",
        filename: this.filename,
      };
    const file = await this.convertImage();
    return { file, mimeType: "image/webp", filename: this.filename };
  }
}
