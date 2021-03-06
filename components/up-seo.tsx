import { NextSeo } from "next-seo";
import { useRouter } from "next/router";

export default function UpSEO({
    title = "Beta Testing Manager: Supercharge your startup by managing your beta testing in one place.",
    description = "An all-in-one tool for keeping track of beta testers.",
    projectName = "",
    imgUrl = null,
    authorUsername = null,
    publishedDate = null,
    noindex = false,
}: { title?: string, description?: string, projectName?: string, imgUrl?: string, authorUsername?: string, publishedDate?: string, noindex?: boolean }) {
    const router = useRouter();
    const fullTitle = title + (projectName ? ` | ${projectName} on Beta Testing Manager` : " | Beta Testing Manager");

    let openGraph = {
        title: fullTitle,
        description: description,
        url: "https://btm.vercel.app" + router.asPath,
        images: imgUrl ? [
            { url: imgUrl }
        ] : [
            { url: "https://postulate.us/postulate-square.png" }
        ],
    };

    let twitter = {
        site: "@postulate",
        cardType: imgUrl ? "summary_large_image" : "summary",
    };

    // if post page, add article info to openGraph
    if (router.pathname === "/[username]/p/[postUrlName]" && publishedDate && authorUsername) {
        openGraph["article"] = {
            publishedTime: publishedDate,
                authors: [
                `https://postulate.us/@${authorUsername}`,
            ]
        }
    };

    return (
        <NextSeo
            title={fullTitle}
            description={description}
            noindex={noindex}
        />
    );
}