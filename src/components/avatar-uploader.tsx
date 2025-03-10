import { useEffect, useState } from "react";
import Image from "next/image";

type AvatarUploaderProps = {
  value: string | File | null;  // Permite tanto string (URL) quanto File
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function AvatarUploader({ onChange, value }: AvatarUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (value instanceof File) {
      const objectUrl = URL.createObjectURL(value);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl); // Cleanup para evitar vazamento de memória
    } else if (typeof value === 'string') {
      setPreview(value); // Caso o value seja uma URL, utiliza diretamente
    } else {
      setPreview(null); // Se o value for null
    }
  }, [value]);

  return (
    <div className="flex items-center gap-4">
      {/* Se houver uma prévia da imagem, exibe */}
      {preview && (
        <div className="flex justify-center">
          <Image
            src={preview}
            alt="Imagem selecionada"
            width={64}
            height={64}
            className="rounded-full border-2 border-gray-200"
          />
        </div>
      )}
      <label
        htmlFor="file-input"
        className="cursor-pointer text-white bg-black py-2 px-4 rounded-lg focus:outline-none text-sm"
      >
        Escolha sua foto
      </label>
      <input
        id="file-input"
        type="file"
        accept="image/*"
        onChange={onChange} // Passa para o RHF diretamente
        className="hidden"
      />
    </div>
  );
}