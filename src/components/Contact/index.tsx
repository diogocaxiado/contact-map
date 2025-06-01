import { Close } from "@mui/icons-material";
import { Box, IconButton, Modal, TextField, Typography, useTheme } from "@mui/material";
import { useState, type Dispatch, type SetStateAction } from "react";

interface IContact {
  openModal: boolean;
  closeModal: Dispatch<SetStateAction<boolean>>;
}

interface IFormData {
  name: string;
  emailOrPhone: string;
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
}

export const Contact = ({ openModal, closeModal }: IContact) => {
  const theme = useTheme();
  const [formData, setFormData] = useState<IFormData>({
    name: '',
    emailOrPhone: '',
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const fetchAddressByCEP = async (cep: string) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      
      if (!data.erro) {
        setFormData(prev => ({
          ...prev,
          street: data.logradouro || '',
          neighborhood: data.bairro || '',
          city: data.localidade || '',
          state: data.uf || ''
        }));
      } else {
        alert('CEP não encontrado!');
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      alert('Erro ao consultar CEP. Tente novamente.');
    }
  };

  const handleCepBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/\D/g, '');
    if (cep.length === 8) {
      fetchAddressByCEP(cep);
    }
  };

  return (
    <Modal 
      open={openModal} 
      onClose={() => closeModal(false)}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(2px)',
      }}
    >
      <Box
        sx={{
          width: '90%',
          maxWidth: '600px',
          height: 'auto',
          maxHeight: '90vh',
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          overflow: 'auto',
          position: 'relative',
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography 
          variant="h4" 
          component="h1"
          sx={{ 
            mb: 3, 
            color: 'primary.main',
            textAlign: 'center',
          }}
        >
          Cadastro de Contato
        </Typography>

        <IconButton 
          sx={{
            position: 'absolute',
            top: 4,
            right: 4
          }}
          onClick={() => closeModal(false)}
        >
          <Close />
        </IconButton>

        <Box display="flex" flexDirection="column" gap={2} paddingX={4} paddingY={2}>
          {/* Dados Pessoais */}
          <TextField 
            variant="outlined" 
            label="Nome" 
            name="name"
            value={formData.name}
            onChange={handleChange}
            required 
            fullWidth 
          />
          
          <TextField 
            variant="outlined" 
            label="Email ou telefone" 
            name="emailOrPhone"
            value={formData.emailOrPhone}
            onChange={handleChange}
            required 
            fullWidth 
          />

          {/* Consulta CEP */}
          <TextField 
            variant="outlined" 
            label="CEP" 
            name="cep"
            value={formData.cep}
            onChange={handleChange}
            onBlur={handleCepBlur}
            inputProps={{ maxLength: 9 }}
            required 
            fullWidth 
          />

          <Box display='flex' gap={4}>
            <TextField 
              variant="outlined" 
              label="Logradouro" 
              name="street"
              value={formData.street}
              onChange={handleChange}
              required 
              fullWidth 
            />
            <TextField 
              variant="outlined" 
              label="Número" 
              name="number"
              value={formData.number}
              onChange={handleChange}
              required 
              fullWidth 
            />
          </Box>
          
          <TextField 
            variant="outlined" 
            label="Complemento" 
            name="complement"
            value={formData.complement}
            onChange={handleChange}
            fullWidth 
          />
          
          <Box display='flex' gap={4}>
            <TextField 
              variant="outlined" 
              label="Bairro" 
              name="neighborhood"
              value={formData.neighborhood}
              onChange={handleChange}
              required 
              fullWidth 
            />
            <TextField 
              variant="outlined" 
              label="Cidade" 
              name="city"
              value={formData.city}
              onChange={handleChange}
              required 
              fullWidth 
            />
            <TextField 
              variant="outlined" 
              label="Estado" 
              name="state"
              value={formData.state}
              onChange={handleChange}
              required 
              fullWidth 
              inputProps={{ maxLength: 2 }}
            />
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};