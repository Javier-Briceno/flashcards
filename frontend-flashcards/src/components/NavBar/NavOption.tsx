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
            <img src={LibraryIcon} className="iconOption" />
            <div className="textOption">Home</div>
          </>
        );
      case 'decks':
        return (
          <>
            <img src={LibraryIcon} className="iconOption" />
            <div className="textOption">Library</div>
          </>
        );
      default:
        return (
          <>
            <img src={LibraryIcon} className="iconOption" />
            <div className="textOption">Unknown</div>
          </>
        );
    }
  };

  return (
    <Link to = {"/" + destination}>
      <div className="barOption">
        {renderContent()}
        <div className="fancyTab"></div>
        <div className="fancyCorner"></div>
        <div className="fancyCover cov1"></div>
        <div className="fancyCover cov2"></div>
      </div>
    </Link>
    )
}

export default NavOption