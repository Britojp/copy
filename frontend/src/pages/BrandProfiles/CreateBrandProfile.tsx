import { useNavigate } from 'react-router-dom';
import BrandProfileForm from './components/BrandProfileForm';

export default function CreateBrandProfilePage() {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/brand-profiles');
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:px-8 lg:pb-8 lg:pt-0">
      <BrandProfileForm profile={null} onClose={handleClose} />
    </div>
  );
}

