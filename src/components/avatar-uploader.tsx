import Image from "next/image";

type AvatarUploaderProps = {
  value: string | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

// TODO: Precisa ser criado um componente que vai dar upload na imagem, lembrando que ela deve ser salva no banco com o ksakdds-kaskdaksd-ksdakskd.png não com o caminho da URL

export function AvatarUploader({ onChange, value }: AvatarUploaderProps) {
  return (
    <div className="flex items-center gap-4">
      {/* Se houver imagem, exibe a imagem com a pré-visualização */}
      {value && (
        <div className="flex justify-center">
          <Image
            src={URL.createObjectURL(value as unknown as Blob)}
            alt="Imagem selecionada"
            width={64}
            height={64}
            className="rounded-full border-2 border-gray-200"
          />
        </div>
      )}
      {/* Botão para escolher a foto */}
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
        onChange={onChange}
        className="hidden"
      />
    </div>
  );
}