import { useNavigate } from 'react-router-dom';
import BrandProfileForm from './components/BrandProfileForm';

export default function CreateBrandProfilePage() {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/brand-profiles');
  };

  return (
    <div className="min-h-screen bg-background p-3 sm:p-4 lg:px-6 lg:pb-6 lg:pt-0">
      <BrandProfileForm profile={null} onClose={handleClose} />
    </div>
  );
}

