import { Link } from 'react-router-dom';
import LibraryIcon from '../../assets/library.svg'
import './NavOption.css'

interface NavOptionProps {
  destination?: string;
}

function NavOption({ destination }: NavOptionProps) {
  const renderContent = () => {
    switch (destination) {
      case '':
        return (
          <>
            <img src={LibraryIcon} className="icon-option" />
            <div className="text-option">Home</div>
          </>
        );
      case 'decks':
        return (
          <>
            <img src={LibraryIcon} className="icon-option" />
            <div className="text-option">Library</div>
          </>
        );
      default:
        return (
          <>
            <img src={LibraryIcon} className="icon-option" />
            <div className="text-option">Unknown</div>
          </>
        );
    }
  };

  return (
    <Link to = {"/" + destination}>
      <div className="bar-option">
        {renderContent()}
        <div className="fancy-tab"></div>
        <div className="fancy-corner"></div>
        <div className="fancy-cover cov-bottom"></div>
        <div className="fancy-cover cov-top"></div>
      </div>
    </Link>
    )
}

export default NavOption