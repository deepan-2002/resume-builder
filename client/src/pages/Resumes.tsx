import Button from '../components/common/Button'
import { AddOutlined } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom';

const Resumes = () => {

    const navigate = useNavigate();

  return (
    <Button onClick={() => navigate('/resumes/create')}>
        <AddOutlined />
        New Resume
    </Button>
  )
}

export default Resumes