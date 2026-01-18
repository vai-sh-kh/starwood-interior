import Image from "next/image";

export default function ServicesHeader() {
    return (
        <header className="relative w-full h-[50vh] overflow-hidden pt-20">
            <div className="absolute inset-0 w-full h-full">
                <Image
                    alt="Services Header"
                    src="/images/service-header.webp"
                    fill
                    className="object-cover"
                    priority
                />
            </div>
            <div className="absolute inset-0 bg-stone-100/20 mix-blend-multiply"></div>
        </header>
    );
}
