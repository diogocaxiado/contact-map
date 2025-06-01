import { Box, Button } from '@mui/material';
import { PersonAdd } from '@mui/icons-material'
import { Map } from '../../components/Map';
import { useState } from 'react';
import { Contact } from '../../components/Contact';

export default function Home() {
  const [openModal, setOpenModal] = useState(false);
  return (
    <Box minWidth='100vw' display='flex' flexDirection='column' alignItems='center' justifyContent='center' height='100vh'>
      <Button startIcon={<PersonAdd />} onClick={() => setOpenModal(true)}>Cadastrar contato</Button>
      <Map />  

      <Contact openModal={openModal} closeModal={() => setOpenModal(false)}/>
    </Box>
  )
}