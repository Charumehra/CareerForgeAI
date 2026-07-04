import { Link, useNavigate } from 'react-router'
import './loading-screen.scss'

const LoadingScreen = ({
  title = 'Loading your experience',
  subtitle = 'Please wait while we prepare the next screen.',
  detail = 'This may take a few seconds.',
  showActions = true,
  homeTo = '/',
}) => {
  const navigate = useNavigate()

  return (
    <main className='loading-screen' aria-busy='true' aria-live='polite'>
      <div className='loading-screen__glow loading-screen__glow--one' />
      <div className='loading-screen__glow loading-screen__glow--two' />

      <section className='loading-screen__card'>
        <div className='loading-screen__ring' aria-hidden='true'>
          <span className='loading-screen__ring-core' />
          <span className='loading-screen__ring-orbit loading-screen__ring-orbit--one' />
          <span className='loading-screen__ring-orbit loading-screen__ring-orbit--two' />
        </div>

        <div className='loading-screen__copy'>
          <p className='loading-screen__eyebrow'>Working on it</p>
          <h1>{title}</h1>
          <p className='loading-screen__subtitle'>{subtitle}</p>

          <div className='loading-screen__bar' aria-hidden='true'>
            <span />
          </div>

          <p className='loading-screen__detail'>{detail}</p>

          {showActions && (
            <div className='loading-screen__actions'>
              <button
                type='button'
                className='loading-screen__button loading-screen__button--ghost'
                onClick={() => navigate(-1)}
              >
                Go back
              </button>

              <Link to={homeTo} className='loading-screen__button loading-screen__button--solid'>
                Go home
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

export default LoadingScreen