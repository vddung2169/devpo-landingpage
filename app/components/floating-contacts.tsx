"use client";

export function FloatingContacts() {
  return (
    <div className="fixed right-6 bottom-42 z-50 flex flex-col gap-3">
      {/* Messenger */}
      <a
        href="https://www.facebook.com/share/1H5cf45rLH/?mibextid=wwXIfr"
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex h-12 w-12 items-center justify-center rounded-full bg-gray-400 shadow-lg transition-all hover:scale-110 hover:shadow-xl animate-wiggle"
        aria-label="Contact us on Messenger"
      >
        <img
          src="/mess.jpg"
          alt="Messenger"
          className="absolute rounded-full p-1"
        />
      </a>

      {/* Zalo */}
      <a
        href="https://zalo.me/4289073059490896771"
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex h-12 w-12 items-center justify-center rounded-full bg-gray-400 shadow-lg transition-all hover:scale-110 hover:shadow-xl animate-wiggle"
        aria-label="Contact us on Zalo"
      >
        <img src="/zalo.jpg" alt="Zalo" className="absolute rounded-full p-1" />
      </a>
    </div>
  );
}
