import { describe, expect, it } from "vitest";
import { javaCourse, rustCourse } from "@/data/courses";
import { getLessons } from "@/lib/lessons";
import { breadcrumbJsonLd, courseJsonLd, jsonLdScript } from "./course-jsonld";

describe("courseJsonLd", () => {
  it.each([[rustCourse], [javaCourse]])("names $name with its descriptor as the alternate name", (course) => {
    const ld = courseJsonLd(course, []);
    expect(ld.name).toBe(`${course.name}: ${course.descriptor}`);
    expect(ld.alternateName).toBe(course.descriptor);
  });
});

describe("breadcrumbJsonLd", () => {
  it("runs Origan > Resources > course on a course index", () => {
    const crumbs = breadcrumbJsonLd(rustCourse);
    expect(crumbs["@type"]).toBe("BreadcrumbList");
    expect(crumbs.itemListElement.map((step) => step.name)).toEqual(["Origan", "Resources", "Oxidise"]);
    expect(crumbs.itemListElement.map((step) => step.position)).toEqual([1, 2, 3]);
    expect(crumbs.itemListElement[1].item).toBe("https://origan.verastack.dev/resources/");
  });

  it("adds the lesson, with its own URL, on a lesson page", () => {
    const lesson = getLessons(javaCourse)[0];
    const crumbs = breadcrumbJsonLd(javaCourse, lesson);
    const last = crumbs.itemListElement[crumbs.itemListElement.length - 1];
    expect(crumbs.itemListElement).toHaveLength(4);
    expect(last.name).toBe(lesson.title);
    expect(last.item).toBe(`https://origan.verastack.dev${javaCourse.path}${lesson.slug}/`);
  });

  it("serialises without a closing script tag", () => {
    expect(jsonLdScript({ a: "</script>" })).not.toContain("</script>");
  });
});
