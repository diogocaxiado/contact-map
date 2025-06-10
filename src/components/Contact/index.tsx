import { Close } from "@mui/icons-material";
import { Box, Button, IconButton, Modal, TextField, Typography, useTheme } from "@mui/material";
import { useState, type Dispatch, type SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from "react-toastify";
import { contactSchema, type ContactFormData } from "../../schemas/contact";

interface IContact {
  openModal: boolean;
  closeModal: Dispatch<SetStateAction<boolean>>;
}

export const Contact = ({ openModal, closeModal }: IContact) => {
  const theme = useTheme();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
    watch
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema)
  });

  const [_, setListContacts] = useState<IContact[]>(() => {
    const storedContacts = localStorage.getItem('contatos');
    return storedContacts ? JSON.parse(storedContacts) : [];
  });

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'cep') {
      const numericValue = value.replace(/\D/g, '').slice(0, 8);
      setValue('cep', numericValue);
      
      if (numericValue.length === 8) {
        await fetchAddressByCEP(numericValue);
        trigger(['street', 'neighborhood', 'city', 'state']);
      }
    } else {
      setValue(name as keyof ContactFormData, value);
    }
  };

  const fetchAddressByCEP = async (cep: string) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      
      if (!data.erro) {
        setValue('street', data.logradouro || '');
        setValue('neighborhood', data.bairro || '');
        setValue('city', data.localidade || '');
        setValue('state', data.uf || '');
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
    }
  };

  const handleSave = (data: any) => {
    try {
      const newContact = {
        ...data,
        id: crypto.randomUUID(),
      };

      setListContacts((prev: IContact[]) => {
        console.log('prev:', prev)
        console.log('newContract:', newContact)
        let updatedContacts = []

        if (!prev) {
          updatedContacts = [newContact]
        } else {
          updatedContacts = [...prev, newContact];
        }

        console.log('updatedContacts:', updatedContacts)
        
        localStorage.setItem('contatos', JSON.stringify(updatedContacts));
        
        return updatedContacts;
      });

      
      closeModal(false);
      toast.success('O contato foi cadastrado com sucesso!');
    } catch (e: any) {
      toast.error('Ocorreu um erro inesperado! Tente novamente mais tarde.');
    }
  } 

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
          aria-label="Fechar modal"
          sx={{
            position: 'absolute',
            top: 4,
            right: 4
          }}
          onClick={() => closeModal(false)}
        >
          <Close />
        </IconButton>

        <form onSubmit={handleSubmit((data) => handleSave(data))}>
          <Box display="flex" flexDirection="column" gap={2} paddingX={4} paddingY={2}>
            <TextField
              label="Nome" 
              {...register('name')}
              error={!!errors.name}
              helperText={errors.name?.message}
              fullWidth 
            />
            
            <TextField 
              label="Email ou Telefone" 
              {...register('emailOrPhone')}
              error={!!errors.emailOrPhone}
              helperText={errors.emailOrPhone?.message}
              fullWidth 
            />

            <TextField 
              label="Cep" 
              {...register('cep')}
              onChange={handleChange}
              value={watch('cep')}
              error={!!errors.cep}
              helperText={errors.cep?.message}
              fullWidth 
            />

            <Box display='flex' gap={4}>
              <TextField
                label="Logradouro" 
                {...register('street')}
                value={watch('street')}
                error={!!errors.street}
                helperText={errors.street?.message}
                fullWidth 
              />
              <TextField 
                label="Número" 
                {...register('number')}
                error={!!errors.number}
                helperText={errors.number?.message}
                fullWidth
              />
            </Box>
            
            <TextField 
              label="Complemento" 
              {...register('complement')}
              error={!!errors.complement}
              helperText={errors.complement?.message}
              fullWidth
            />
            
            <Box display='flex' gap={4}>
              <TextField 
                label="Bairro" 
                {...register('neighborhood')}
                error={!!errors.neighborhood}
                helperText={errors.neighborhood?.message}
                fullWidth
              />
              <TextField 
                label="Cidade" 
                {...register('city')}
                error={!!errors.city}
                helperText={errors.city?.message}
                fullWidth
              />
              <TextField 
                label="Estado" 
                {...register('state')}
                error={!!errors.state}
                helperText={errors.state?.message}
                fullWidth
              />
            </Box>

            <Button type="submit" variant="contained">Cadastrar</Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};