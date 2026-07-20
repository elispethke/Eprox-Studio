import { notFound } from "next/navigation";

/** Catch-all: any unmatched path inside a locale renders the branded 404. */
export default function CatchAllNotFound() {
  notFound();
}
