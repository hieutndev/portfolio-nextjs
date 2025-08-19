"use client";

import Container from "@/components/shared/container/container";

export default function Loading() {
    return (
        <div className="w-full flex flex-col gap-8">
            {/* Header skeleton */}
            <Container className="!p-4 items-center" orientation="vertical">
                <div className="w-24 h-8 bg-gray-200 rounded animate-pulse mb-4" />
                <div className="w-3/4 h-8 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="w-1/2 h-4 bg-gray-200 rounded animate-pulse mb-4" />
                <div className="w-full max-w-4xl h-64 bg-gray-200 rounded animate-pulse" />
            </Container>

            {/* Content skeleton */}
            <Container className="!p-4" orientation="vertical">
                <div className="space-y-4">
                    <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="w-5/6 h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="w-4/5 h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse" />
                </div>
            </Container>

            {/* Footer skeleton */}
            <Container className="!p-4 items-center" orientation="vertical">
                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center items-center">
                    <div className="w-32 h-10 bg-gray-200 rounded animate-pulse" />
                    <div className="w-32 h-10 bg-gray-200 rounded animate-pulse" />
                </div>
            </Container>
        </div>
    );
}
