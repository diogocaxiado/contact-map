 interface ISearchCep {
    setAddress: (address: string) => void;
    setPosition: (position: [number, number]) => void;
    setZoom: (zoom: number) => void;
    cep: string;
 }

 export const searchCEP = async ({setAddress, setPosition, setZoom, cep}: ISearchCep) => {
    const cleanedCEP = cep.replace(/\D/g, '');

    if (cleanedCEP.length !== 8) return;

    try {
      const viaCepResponse = await fetch(`https://viacep.com.br/ws/${cleanedCEP}/json/`);
      const viaCepData = await viaCepResponse.json();

      if (viaCepData.erro) {
        console.error('CEP não encontrado na ViaCEP');
        return;
      }

      const { logradouro, bairro, localidade, uf } = viaCepData;
      setAddress(`${logradouro}, ${bairro}, ${localidade} - ${uf}`);

      const nominatimResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?street=${encodeURIComponent(
          logradouro
        )}&city=${encodeURIComponent(localidade)}&state=${encodeURIComponent(
          uf
        )}&country=Brazil&format=json`
      );

      const nominatimData = await nominatimResponse.json();
      console.log(nominatimData)

      if (nominatimData[0]) {
        const newPosition: [number, number] = [
          parseFloat(nominatimData[0].lat), 
          parseFloat(nominatimData[0].lon)
        ];
        setPosition(newPosition);
        setZoom(17);
      } else {
        console.error('Endereço não encontrado no Nominatim');
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
    }
  };