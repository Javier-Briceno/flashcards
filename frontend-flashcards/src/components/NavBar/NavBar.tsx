import Logo from '../../assets/sample_logo.png'
import NavOption from './NavOption'
import './NavBar.css'

function NavBar() {
    return(
        <div className="navBar">
        <img src={Logo} id="logo"/>
        <NavOption destination=''/>
        <NavOption destination='decks'/>
      </div>
    )
}

export default NavBar