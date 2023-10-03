import React, { useEffect } from 'react';
import axios from 'axios';
import { serverConnectionStatus } from '../utils/APIRoutes';
import styled from 'styled-components';
import logo1 from '../static/images/logos/swiich-logo1.jpg';
import logo from '../static/images/logos/swiich-primary-logo.png';
import logo2 from '../static/images/logos/swiich-logo2.jpg';
import switchLogo from '../static/images/logos/swiich-secondy-logo.png'
import { Link } from 'react-router-dom';
import Diversity2OutlinedIcon from '@mui/icons-material/Diversity2Outlined';
import SyncLockOutlinedIcon from '@mui/icons-material/SyncLockOutlined';
import FolderCopyOutlinedIcon from '@mui/icons-material/FolderCopyOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import NotificationImportantOutlinedIcon from '@mui/icons-material/NotificationImportantOutlined';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import EastOutlinedIcon from '@mui/icons-material/EastOutlined';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';

const ICON_SMALL = 24;

function Home () {
  const getServerConnectionStatus = async () => {
    try {
      const { data } = await axios.get(serverConnectionStatus);
      console.log(data.message);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getServerConnectionStatus();
  }, []);

  return (
    <PageWrapper>
      <header className='header'>
        <div className='container'>
          <nav className='navbar a-nav'>
            <div className='navbar__row'>
              <div className='navbar__brand navbar__row__column-rigt'>
                <img
                  width={200}
                  height={70}
                  src={logo}
                  alt='Header Logo'
                />
              </div>
              <div className='navbar__left navbar__row__column-left'>
                <ul className='navbar__menu'>
                  <li className='navbar__menu__menu-item'>
                    <Link
                      className='navbar__menu__menu-item__link nav-link'
                      to='#features'
                    >
                      Features
                    </Link>
                  </li>
                  <li className='navbar__menu__menu-item'>
                    <Link
                      className='navbar__menu__menu-item__link nav-link'
                      to='#solutions'
                    >
                      Solutions
                    </Link>
                  </li>
                  <li className='navbar__menu__menu-item'>
                    <Link
                      className='navbar__menu__menu-item__link nav-link'
                      to='#about'
                    >
                      About us
                    </Link>
                  </li>
                  <li className='navbar__menu__menu-item'>
                    <Link
                      className='navbar__menu__menu-item__link nav-link'
                      to='#pricing'
                    >
                      Pricing
                    </Link>
                  </li>
                </ul>
                <div className='navbar__actions'>
                  <Link
                    className='navbar__actions__link nav-link nav-link__btn nav-link__btn__outlined'
                    to='/login'
                  >
                    Sign in
                  </Link>
                  <Link
                    className='navbar__actions__link nav-link nav-link__btn'
                    to='/register'
                  >
                    Create Organization
                  </Link>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </header>
      <main>
        <section id='hero'>
          <div className='hero__palete'>
            <div className='container'>
              <div className='hero'>
                <div className='hero__left'>
                  <h1 className='hero__left__heading'>
                    <span>
                      Great teamwork start with a&nbsp;
                    </span>
                    <span className='hero__left__heading__contract color__organe'>
                      digital HQ.
                    </span>
                  </h1>
                  <div className='hero__left__text'>
                    <p>
                      With all your people, tools, and communications in one place, you can work faster and more flexible than ever before.
                    </p>
                  </div>
                  <div className='hero__left__action'>
                    <form>
                      <input
                        type='email'
                        name='email'
                        placeholder='Email Address'
                      />
                      <button type='submit'>Get Started</button>
                    </form>
                  </div>
                </div>
                <div className='hero__right'>
                  <img src={logo1} alt='Hero Demostrations' />
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id='features'>
          <div className='features__palete'>
            <div className='container'>
              <div className='features'>
                <h2 className='features__heading'>Our Amazing Features</h2>
                <div className='features__grid'>
                  <div className='features__grid__item'>
                    <h5> <Diversity2OutlinedIcon sx={{ width: ICON_SMALL, height: ICON_SMALL, color: '#0ddfae' }} /> Group conversations</h5>
                    <article>
                      <p>
                        Talk, share information, and make decisions in open groups like annoucement and general across your staff members, and in private
                        groups/departments for more sensitive matters.
                      </p>
                    </article>
                  </div>
                  <div className='features__grid__item'>
                    <h5><FolderCopyOutlinedIcon sx={{ width: ICON_SMALL, height: ICON_SMALL, color: '#005ad4' }} /> File sharing</h5>
                    <article>
                      <p>
                        Drag and drop files, documents, PDFs, images, and video to share with
                        anyone and get immediate feedback and discussion through comments.
                      </p>
                    </article>
                  </div>
                  <div className='features__grid__item'>
                    <h5><SearchOutlinedIcon sx={{ width: ICON_SMALL, height: ICON_SMALL, color: '#181447' }} /> Deep, contextual search</h5>
                    <article>
                      <p>
                        Search across your entire team archives, within documents, files, or images, and filter your result by recent, relevancy, person, and more.
                      </p>
                    </article>
                  </div>
                  <div className='features__grid__item'>
                    <h5><SyncLockOutlinedIcon sx={{ width: ICON_SMALL, height: ICON_SMALL, color: '#fcd599' }} /> Private conversations</h5>
                    <article>
                      <p>
                        Talk, share information, and make decisions in open groups like annoucement and general across your staff members, and in private
                        groups/departments for more sensitive matters, or use direct messages
                        to communicate specifically to your target member(s) within your organization.
                      </p>
                    </article>
                  </div>
                  <div className='features__grid__item'>
                    <h5><NotificationImportantOutlinedIcon sx={{ width: ICON_SMALL, height: ICON_SMALL, color: '#fc3f57' }} /> Instant notifications</h5>
                    <article>
                      <p>
                        Get instant notifications on tasks assignment and updates, messages repley, group invites etc, sent direct to your device even if your
                        not logged in, as long as you are connnected to the internent.
                      </p>
                    </article>
                  </div>
                  <div className='features__grid__item'>
                    <h5><ListAltOutlinedIcon sx={{ width: ICON_SMALL, height: ICON_SMALL, color: '#01ebb8' }} /> Task management</h5>
                    <article>
                      <p>
                        Create tasks, assign them to individuals or teams, mornitor their progerss and challenges. Set due dates. Notifications will be
                        sent for task assignments, updates, and approaching deadlines.
                      </p>
                    </article>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id='solutions'>
          <div className='learn-more__palete'>
            <div className='container'>
              <div className='learn-more'>
                <span className='learn-more__text'>
                  Explore the potential of <span className='color__organe'>Swiich</span> and all that it can help you achieve.
                </span>
                <Link
                  className='learn-more__link learn-more__btn'
                  to='/register'
                >
                  <span>Take a tour</span>
                  <EastOutlinedIcon sx={{ width: ICON_SMALL, height: ICON_SMALL }} />
                </Link>
              </div>
            </div>
          </div>
          <div className='solutions__palete'>
            <div className='solutions'>
              <div className='container'>
                <div className='solutions__solution'>
                  <div className='solutions__solution__right text-first'>
                    <article>
                      <h4 className='solutions__solution__heading'>Say goodbye to those neverending email threads.</h4>
                      <p className='solutions__solution__text'>
                        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Facere explicabo dolorem accusantium ducimus. Ipsam blanditiis, ad accusantium temporibus iste dolor! Rerum veritatis, vero cupiditate impedit tempora ratione aspernatur quasi maiores.
                      </p>
                    </article>
                  </div>
                  <div className='solutions__solution__left secondry img__wrapper clip-path-left'>
                    <img src={logo2} alt='Solutions Demostrations one' />
                  </div>
                </div>
              </div>
              <hr />
              <div className='container'>
                <div className='solutions__solution'>
                  <div className='solutions__solution__right img__wrapper primary img-first clip-path-right'>
                    <img src={logo2} alt='Solutions Demostrations two' />
                  </div>
                  <div className='solutions__solution__left'>
                    <article>
                      <h4 className='solutions__solution__heading'>Like your team's collective brain.</h4>
                      <p className='solutions__solution__text'>
                        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Facere explicabo dolorem accusantium ducimus. Ipsam blanditiis, ad accusantium temporibus iste dolor! Rerum veritatis, vero cupiditate impedit tempora ratione aspernatur quasi maiores.
                      </p>
                    </article>
                  </div>
                </div>
              </div>
              <hr />
              <div className='container'>
                <div className='solutions__solution'>
                  <div className='solutions__solution__right text-first'>
                    <article>
                      <h4 className='solutions__solution__heading'>
                        Wherever you go.
                      </h4>
                      <p className='solutions__solution__text'>
                        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Facere explicabo dolorem accusantium ducimus. Ipsam blanditiis, ad accusantium temporibus iste dolor! Rerum veritatis, vero cupiditate impedit tempora ratione aspernatur quasi maiores.
                      </p>
                    </article>
                  </div>
                  <div className='solutions__solution__left tertiary img__wrapper clip-path-left'>
                    <img src={logo2} alt='Solutions Demostrations three' />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer id='footer'>
        <div className='footer__palete '>
          <div className='take-action__palete'>
            <div className="container">
              <div className='take__action'>
                <h3>
                Unlock <span className='color__organe'>Swiich's</span> limitless potential
                </h3>
                <form>
                  <input
                    type='email'
                    name='email'
                    placeholder='Email Address'
                  />
                  <button type='submit'>Get Started</button>
                </form>
              </div>
            </div>
          </div>
          <div className='container'>
            <div className='footer'>
              <nav className='footer__menu'>
                <ul className='footer__menu__row'>
                  <li className='footer__menu__row__columns'>
                    <h6>WHY SWIICH?</h6>
                    <ul className='nested-menu'>
                      <li className='nested-menu__item'>
                        <Link to="#" className='nested-menu__item__link'>Departments</Link>
                      </li>
                      <li className='nested-menu__item'>
                        <Link to="#" className='nested-menu__item__link'>Programmes</Link>
                      </li>
                      <li className='nested-menu__item'>
                        <Link to="#" className='nested-menu__item__link'>Scale</Link>
                      </li>
                      <li className='nested-menu__item'>
                        <Link to="#" className='nested-menu__item__link'>
                          Watch the Demo
                        </Link>
                      </li>
                    </ul>
                  </li>
                  <li className='footer__menu__row__columns'>
                    <h6>PRODUCT</h6>
                    <ul className='nested-menu'>
                      <li className='nested-menu__item'>
                        <Link to="#" className='nested-menu__item__link'>Features</Link>
                      </li>
                      <li className='nested-menu__item'>
                        <Link to="#" className='nested-menu__item__link'>Integrations</Link>
                      </li>
                      <li className='nested-menu__item'>
                        <Link to="#" className='nested-menu__item__link'>Enterprise</Link>
                      </li>
                      <li className='nested-menu__item'>
                        <Link to="#" className='nested-menu__item__link'>
                          Solutions
                        </Link>
                      </li>
                    </ul>
                  </li>
                  <li className='footer__menu__row__columns'>
                    <h6>PRICING</h6>
                    <ul className='nested-menu'>
                      <li className='nested-menu__item'>
                        <Link to="#" className='nested-menu__item__link'>Plans</Link>
                      </li>
                      <li className='nested-menu__item'>
                        <Link to="#" className='nested-menu__item__link'>Paid vs. Free</Link>
                      </li>
                    </ul>
                  </li>
                  <li className='footer__menu__row__columns'>
                    <h6>RESOURCES</h6>
                    <ul className='nested-menu'>
                      <li className='nested-menu__item'>
                        <Link to="#" className='nested-menu__item__link'>Partners</Link>
                      </li>
                      <li className='nested-menu__item'>
                        <Link to="#" className='nested-menu__item__link'>Developers</Link>
                      </li>
                      <li className='nested-menu__item'>
                        <Link to="#" className='nested-menu__item__link'>Enterprise</Link>
                      </li>
                      <li className='nested-menu__item'>
                        <Link to="#" className='nested-menu__item__link'>
                          Apps
                        </Link>
                      </li>
                      <li className='nested-menu__item'>
                        <Link to="#" className='nested-menu__item__link'>
                        Blog
                        </Link>
                      </li>
                      <li className='nested-menu__item'>
                        <Link to="#" className='nested-menu__item__link'>
                          Help Center
                        </Link>
                      </li>
                      <li className='nested-menu__item'>
                        <Link to="#" className='nested-menu__item__link'>
                          Events
                        </Link>
                      </li>
                    </ul>
                  </li>
                  <li className='footer__menu__row__columns'>
                    <h6>SUPPORT AND TOOLS</h6>
                    <ul className='nested-menu'>
                      <li className='nested-menu__item'>
                        <Link to="#" className='nested-menu__item__link'>About Us</Link>
                      </li>
                      <li className='nested-menu__item'>
                        <Link to="#" className='nested-menu__item__link'>Swiich Partners</Link>
                      </li>
                      <li className='nested-menu__item'>
                        <Link to="#" className='nested-menu__item__link'>Join a local user group support</Link>
                      </li>
                      <li className='nested-menu__item'>
                        <Link to="#" className='nested-menu__item__link'>
                          Careers
                        </Link>
                      </li>
                      <li className='nested-menu__item'>
                        <Link to="#" className='nested-menu__item__link nested-menu__item__link__btn'>
                          Contact Swiich Support
                        </Link>
                      </li>
                      <li className='nested-menu__item social-medias'>
                        <Link to="#" className='nested-menu__item__link nested-menu__item__link__medias facebook'>
                          <FacebookIcon sx={{ width: ICON_SMALL, height: ICON_SMALL }} />
                        </Link>
                        <Link to="#" className='nested-menu__item__link nested-menu__item__link__medias twitter'>
                          <TwitterIcon sx={{ width: ICON_SMALL, height: ICON_SMALL }} />
                        </Link>
                        <Link to="#" className='nested-menu__item__link nested-menu__item__link__medias youtube'>
                          <YouTubeIcon sx={{ width: ICON_SMALL, height: ICON_SMALL }} />
                        </Link>
                        <Link to="#" className='nested-menu__item__link nested-menu__item__link__medias linkedin'>
                          <LinkedInIcon sx={{ width: ICON_SMALL, height: ICON_SMALL }} />
                        </Link>
                      </li>
                    </ul>
                  </li>
                </ul>
              </nav>
              <hr />
              <div className="footer__baseline">
                <div className='footer__baseline__brand'>
                  <Link
                    to="/"
                    className='footer__baseline__logo__brand-link'
                  >
                    <img
                      width={200}
                      height={65}
                      src={switchLogo}
                      alt='Footer Logo'
                    />
                  </Link>
                </div>
                <div>
                  <span>Copyright &copy; 2023 Swiich, Inc</span> 
                </div>
                <div className='footer__baseline__privacy'>
                  <Link className='footer__baseline__privacy__links' to='#'>Privacy Policy</Link>
                  <Link className='footer__baseline__privacy__links' to='#'>Legal Stuff</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  // Utilities
  .container {
    max-width: 81.25em;
    margin-inline: auto;
    padding-inline: 1rem;
    margin: 0 auto;
    position: relative;
  }

  .primary {
    background-color: #005ad4;
    // background-color: var(--color-secondry); 
  }
  
  .secondry {
    background-color: #0ddfae; 
    // background-color: var(--color-primary); 
  }
  
  .tertiary {
    background-color: #fc3f57; 
    // background-color: var(--color-tertiary); 
  }
  
  hr {
    height: 2px;
    border: 0;
    box-shadow: inset 0 12px 12px -12px rgba(0, 0, 0, 0.1);
  }

  .color__organe {
    color: #fd6760;
  }

  // Main styles  
  .header {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    background-color: var(--color-primary); 
    color: var(--color-white);
    z-index: 1000;
    // border: 1px solid red;

    .nav-link {
      // text-decoration: none;
      color: inherit;
      padding: 1rem 2rem;

      &__btn {
        background-color: var(--color-white);
        color: var(--color-primary);
        border-radius: 3px;
        text-decoration: none;
        text-transform: uppercase;
        margin: 0 2rem;

        &__outlined {
          border: 0.1px solid var(--color-white);
          background-color: var(--color-primary);
          color: var(--color-white);
        }
      }
    }

    .navbar {
      // position: sticky;
      // top: 0;
      // left: 0;
      // width: 100%;
      // height: 80px;
      // background-color: transparent;
      // background-color: var(--color-primary); 

      &__row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 3rem;
        padding: 2rem 0;
        // border: 1px solid grey;

        &__column-left {
          flex: 1;
          // border: 1px solid green;
          display: flex;
          align-items: center;
          gap: 3rem;
        }
      }

      &__brand {

      }

      &__menu {
        flex: 1;
        display: flex;
        // justify-content: space-between;
        align-items: center;
        gap: 3rem;
        list-style-type: none;
        // border: 1px solid yellow;
      }

      &__actions {
        justify-self: flex-end;
        // border: 1px solid red;
      }
    }

  }
  .hero__palete {
    background-color: var(--color-primary); 
    color: var(--color-white);
  }

  .hero {
    padding-top: 8.5rem;
    padding-bottom: 8rem;
    z-index: 1;
    display: grid;
    // grid-template-columns: repeat(2, 1fr);
    // grid-gap: 2rem;
    grid-template-columns: 53% 40%;
    grid-column-gap: 5%;
    // justify-items: start;

    &__left {
      margin-top: 5rem;
      padding: 1rem 0;

      &__heading {
        line-height: 1;
        font-size: var(--font-size-xxx-large);
        // font-size: clamp(3rem, 10vw, 5rem);
        font-weight: var(--font-weight-x-bold);
        margin-bottom: 1rem;

        // &__contract {
        //   // color: var(--color-secondry);
        //   // color: var(--color-tertiary);
        //   color: #fd6760;
        // }
      } 
      
      &__text {
        font-size: var(--font-size-x-large);
        font-weight: var(--font-weight-bold);
      }

      &__action {
        margin-top: 2rem;
        // width: 50%;

        form {
          // display: flex;
          flex-direction: row;
          gap: 1rem;
          max-width: 500px;
        

          button {
            background-color: var(--color-primary);
            border: 0.1px solid var(--color-white);
            border-radius: 3px;
            color: var(--color-white);
            display: inline-block;
            font-size: var(--font-size-small);
            font-weight: var(--font-weight-bold);
            min-width: 35%;
            outline: none;
            padding: 0 2rem;
            text-transform: uppercase;
          }
        }
      }
    }

    &__right {
      margin-top: 5rem;
      // position: relative;
      border: 1px solid red;
      max-height: 400px;

      img {
        width: 100%;
        height: 100%;
        // max-height: 400px;
        // left: 0;
        // position: absolute;
        // top: 0;
        object-fit: cover;
      }
    }
  }

  .features__palete {
    // background-color: #f4ede4;
    background-color: #f6f5f3;
    
    // color: var(--color-white);
    .features {
      padding: 10rem 0;
      font-size: 100%;
      font-weight: var(--font-weight-bold);

      &__heading {
        font-size: var(--font-size-xx-large);
        text-align: center;
        margin-bottom: 5rem;
      }

      &__grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: repeat(2, 1fr);
        grid-gap: 5rem;

        &__item {
          h5 {
            display: flex;
            align-items: center;
            gap: 1.5rem;
            font-size: var(--font-size-large);
            margin-bottom: 0.8rem;
          }
        }
      }
    }
  }

  .learn-more__palete {
    background-color: var(--color-primary); 
    color: var(--color-white);

    .learn-more {
      padding: 3rem 0;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 3rem;

      &__text {

      }

      &__link {
        background-color: var(--color-primary);
        border: 0.1px solid var(--color-white);
        border-radius: 4px;
        color: var(--color-white);
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 0.5rem 2rem;
        text-decoration: none;
      }
    }
  }

  .solutions__palete {
    background-color: #f6f5f3;

    .solutions {
      padding: 5rem 0;

      &__solution {
        display: grid;
        grid-template-columns: 1fr 1fr;
        // align-items: center;
        grid-gap: 5rem;
        padding: 10rem 0;

        .clip-path-left {
          clip-path: ellipse(100% 100% at center right);
          padding-top: 4rem;
          padding-right: 10rem;
          // background-color: var(--color-secondry);
        }

        .clip-path-right {
          clip-path: ellipse(100% 100% at center left);
          padding-top: 4rem;
          padding-left: 10rem;
          // background-color: var(--color-primary);
        }


        &__left, &__right {
          // width: 50%;
          // border: 1px solid red;

          &>:not(img) {
            display: grid;
            align-content: center;
            justify-items: start;
            height: 100%;
            // border: 1px solid blue;
          }

          &>:is(img) {
            // min-height: 400px;
            // border: 1px solid blue;
            // border-radius: 20%;
            background-color: var(--color-primary);
            // clip-path: ellipse(80% 100% at center left);
          }

          h4 {
            margin-bottom: 1rem;
            font-size: var(--font-size-xx-large);
          }

        }

        &__text {
          font-size: var(--font-size-large);
          font-weight: var(--font-weight-bold);
        }
      }

      .img__wrapper {
        max-height: 350px;
        
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          // object-fit: contain;
        }
      }
    }
  }

  .footer__palete {
    background-color: var(--color-white);

    .take-action__palete {
      background-color: var(--color-primary);
      clip-path: ellipse(75% 100% at center top);

      .take__action {
        padding: 12rem 0;
        text-align: center;

        h3 {
          font-size: var(--font-size-xx-large);
          color: var(--color-white);
          margin-bottom: 2rem;
        }

        form {
          flex-direction: row;
          gap: 1rem;
          max-width: 500px;
          margin: 0 auto;
        

          button {
            background-color: var(--color-primary);
            border: 0.1px solid var(--color-white);
            border-radius: 3px;
            color: var(--color-white);
            display: inline-block;
            font-size: var(--font-size-small);
            font-weight: var(--font-weight-bold);
            min-width: 35%;
            outline: none;
            padding: 0 2rem;
            text-transform: uppercase;
          }
        }
      }
    }

    .footer {
      margin-top: 5rem;

      &__menu {

        &__row {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          grid-gap: 2rem;
          list-style-type: none;

          &__columns {
            h6 {
              font-size: var(--font-size-medium);
            }

            &> * + * {
              margin-top: 2rem;
            }

            .nested-menu {
              list-style-type: none;

              &> * + * {
                margin-top: 2rem;
              }

              &__item {

                &__link {
                  color: inherit;

                  &__btn {
                    background-color: var(--color-tertiary);
                    border-radius: 3px;
                    color: var(--color-white);
                    display: inline-block;
                    padding: 0.8rem 2rem;
                    text-decoration: none;
                    transition: all .3s;
                    width: 100%;

                    
                    &:hover {
                      background-color: var(--color-white);
                      border: 0.1px solid var(--color-primary);
                      color: var(--color-primary);
                      opacity: 0.9;
                    }
                  }
                }
              }

              .social-medias {
                display: flex;
                align-items: center;
                justify-content: space-between;
              }
            }
          }
        }

      }

      hr {
        margin-top: 5rem;
        // margin-bottom: 1rem;
      }

      &__baseline {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 1rem;

        &__brand {
          margin-left: -2rem;
        }

        &__privacy {
          display: flex;
          align-items: center;
          gap: 3rem;

          &__links {
            color: inherit;
          }
        }
      }

    }
  }
`;

export default Home;
