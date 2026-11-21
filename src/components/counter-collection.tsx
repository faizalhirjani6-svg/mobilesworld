const source = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/";
const collection = [
  ["Troops", "Sound Square TP-3090", "Mini outdoor Bluetooth speaker", "IMG_20261121_124757_028-CvOe8tdJIzDAQAhH9Y3rOBgHmKHtwI.jpg"],
  ["Jaybally", "Portable wireless speaker", "Wireless speaker", "IMG_20261121_124755_002-tSd1eP8cCpr3qSDo8QXnWN2h6iqKLR.jpg"],
  ["Lapcare", "Trust I", "10,000 mAh magnetic power bank · 22.5W wired / 15W wireless", "IMG_20261121_124746_645-PKyuI5PZVfN2O0ts3ihSFZSwjNPBoF.jpg"],
  ["UBON", "PB-X88 Pro Power Slice", "10,000 mAh power bank · 15W", "IMG_20261121_124750_942-BFkI3ruoLEAzyQFlSrI0rpnX8rdz1E.jpg"],
  ["Mi", "Power Bank 2i", "20,000 mAh power bank", "IMG_20261121_124752_905-PNj15Sj9SoJQqSHyxG7eWM9uUmjX2m.jpg"],
  ["UBON", "PowerMax PB-SX204", "20,000 mAh power bank", "IMG_20261121_124748_959-NzO4bLQOfbs6Ti3rgtxN4o8pHgXYmM.jpg"],
  ["UBON", "Fighter HP-730", "Wireless headphones", "IMG_20261121_114748_286-QoAt0JH0enYkOCnZQA5dMhxZIDUpxT.jpg"],
  ["boAt", "Rockerz 550", "Headphones", "IMG_20261121_114847_933-hXS4gi5VKvkTVZTmcaWcW0CUMp7vZ7.jpg"],
  ["UBON", "Audio Bull 2.0 BT-5680", "Headphones", "IMG_20261121_124743_611-3zh2sRt79v8YlSe8vGjkrdLweRFMJk.jpg"],
] as const;

export function CounterCollection() {
  return (
    <section aria-labelledby="counter-title" className="my-12 border-y py-8 sm:py-12">
      <div className="mb-7 flex flex-wrap items-baseline justify-between gap-3">
        <h2 id="counter-title" className="text-3xl font-black sm:text-4xl">On the counter</h2>
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">09 products</span>
      </div>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6">
        {collection.map(([brand, model, detail, filename], i) => (
          <li key={filename} className="min-w-0">
            <img src={source + filename} alt={`${brand} ${model}`} loading={i < 3 ? "eager" : "lazy"} decoding="async" className="aspect-square w-full rounded-lg border bg-muted object-contain" />
            <div className="mt-3 flex items-center justify-between border-b pb-2 text-xs font-semibold tracking-widest">
              <span className="text-primary">{brand}</span><span aria-hidden="true" className="text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
            </div>
            <h3 className="mt-2 text-base font-bold leading-tight sm:text-xl">{model}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{detail}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
