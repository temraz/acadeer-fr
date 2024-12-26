import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserPlus, 
  Search, 
  Clock, 
  Calendar, 
  Award, 
  School, 
  Languages,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Star,
  Play,
  Plus,
  Minus,
  Quote,
  Globe2,
  Trophy,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const LandingPage = () => {
  const { t, language, toggleLanguage } = useApp();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`min-h-screen bg-white dark:bg-black text-black dark:text-white ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/80 dark:bg-black/80 backdrop-blur-md' : 'bg-transparent'
      }`}>
        <div className="max-w-[980px] mx-auto px-4 sm:px-6">
          <div className="flex justify-between h-12 items-center">
            <div className="flex items-center">
              <img 
                src="https://cdn-icons-png.flaticon.com/512/2436/2436876.png"
                alt="SubTeacher Hub"
                className="h-8 w-8"
              />
              <span className="ltr:ml-2 rtl:mr-2 text-xl font-semibold">
                acadeer
              </span>
            </div>
            <div className="flex items-center gap-6">
              <button
                onClick={toggleLanguage}
                className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400
                         transition-colors duration-200"
              >
                {language === 'en' ? 'العربية' : 'English'}
              </button>
              <button
                onClick={() => navigate('/login')}
                className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400
                         transition-colors duration-200"
              >
                {t('login')}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-24 overflow-hidden">
        <div className="max-w-[980px] mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 
                       bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600" style={{lineHeight:1.4}}>
            {t('heroTitle')}
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto">
            {t('heroDescription')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/app/become-substitute')}
              className="group relative px-8 py-4 bg-blue-600 text-white rounded-full overflow-hidden
                       transition-all duration-300 hover:bg-blue-700"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {t('becomeASub')}
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 
                           group-hover:opacity-100 transition-opacity duration-300" />
            </button>
            <button
              onClick={() => navigate('/app/post-job')}
              className="px-8 py-4 bg-gray-100 dark:bg-gray-800 rounded-full
                       hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
            >
              {t('postJob')}
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-[980px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              {t('whyChooseUs')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              {t('whyChooseUsDesc')}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: <Search className="w-8 h-8" />,
                title: t('instantMatching'),
                description: t('instantMatchingDesc')
              },
              {
                icon: <Clock className="w-8 h-8" />,
                title: t('flexibleScheduling'),
                description: t('flexibleSchedulingDesc')
              },
              {
                icon: <Award className="w-8 h-8" />,
                title: t('qualifiedTeachers'),
                description: t('qualifiedTeachersDesc')
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="group relative p-8 rounded-3xl bg-white dark:bg-gray-800 shadow-lg
                         hover:scale-105 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 
                             rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/50 
                               flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-24 bg-white dark:bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50 dark:from-blue-900/10 opacity-50" />
        <div className="max-w-[980px] mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { 
                number: '1000+', 
                label: t(language === 'en' ? 'Active Teachers' : 'المعلمون النشطون')
              },
              { 
                number: '500+', 
                label: t(language === 'en' ? 'Partnered Schools' : 'المدارس المشاركة')
              },
              { 
                number: '10,000+', 
                label: t(language === 'en' ? 'Completed Assignments' : 'المهام المكتملة')
              }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl font-bold bg-clip-text text-transparent 
                             bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-lg text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-[980px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              {t(language === 'en' ? 'How It Works' : 'كيف يعمل')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              {t(language === 'en' ? 'Simple steps to get started' : 'خطوات بسيطة للبدء')}
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { 
                step: '01', 
                title: t(language === 'en' ? 'Create Account' : 'إنشاء حساب'),
                desc: t(language === 'en' ? 'Create your profile in minutes and join our community of educators' : 'أنشئ ملفك الشخصي في دقائق وانضم إلى مجتمع المعلمين')
              },
              { 
                step: '02', 
                title: t(language === 'en' ? 'Complete Profile' : 'أكمل الملف الشخصي'),
                desc: t(language === 'en' ? 'Add your qualifications, preferences, and availability schedule' : 'أضف مؤهلاتك وتفضيلاتك وجدول توفرك')
              },
              { 
                step: '03', 
                title: t(language === 'en' ? 'Find Opportunities' : 'ابحث عن الفرص'),
                desc: t(language === 'en' ? 'Browse and apply for teaching positions that match your profile' : 'تصفح وقدم على وظائف التدريس التي تناسب ملفك الشخصي')
              },
              { 
                step: '04', 
                title: t(language === 'en' ? 'Start Teaching' : 'ابدأ التدريس'),
                desc: t(language === 'en' ? 'Begin your journey as a substitute teacher and make an impact' : 'ابدأ رحلتك كمدرس بديل وأحدث تأثيراً')
              }
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="text-7xl font-bold text-gray-100 dark:text-gray-800 absolute -top-8 -left-4">
                  {step.step}
                </div>
                <div className="relative z-10">
                  <h3 className="text-xl font-semibold mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Features Section */}
      <section className="py-24 bg-white dark:bg-black overflow-hidden">
        <div className="max-w-[980px] mx-auto px-4 sm:px-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl transform rotate-3" />
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-4xl font-bold mb-6">
                    {t(language === 'en' ? 'Interactive Features' : 'الميزات التفاعلية')}
                  </h2>
                  <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                    {t(language === 'en' ? 'Discover our powerful tools designed for modern education' : 'اكتشف أدواتنا القوية المصممة للتعليم الحديث')}
                  </p>
                  <div className="space-y-4">
                    {[
                      { 
                        icon: <Globe2 className="w-6 h-6" />, 
                        title: t(language === 'en' ? 'Real-Time Matching' : 'مطابقة فورية') 
                      },
                      { 
                        icon: <Calendar className="w-6 h-6" />, 
                        title: t(language === 'en' ? 'Smart Scheduling' : 'جدولة ذكية') 
                      },
                      { 
                        icon: <Trophy className="w-6 h-6" />, 
                        title: t(language === 'en' ? 'Skill Tracking' : 'تتبع المهارات') 
                      }
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 rounded-xl 
                                               bg-gray-50 dark:bg-gray-700/50">
                        <div className="text-blue-600 dark:text-blue-400">
                          {feature.icon}
                        </div>
                        <span className="font-medium">{feature.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 
                               rounded-xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-500" />
                  <img 
                    src="https://placehold.co/600x400/667EEA/ffffff/png?text=Interactive+Demo"
                    alt="Interactive Features"
                    className="relative rounded-xl shadow-lg transform transition-transform duration-500 
                             group-hover:scale-[1.02]"
                  />
                  <button className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                                  w-16 h-16 bg-white rounded-full flex items-center justify-center
                                  shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Play className="w-6 h-6 text-blue-600 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black">
        <div className="max-w-[980px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              {t(language === 'en' ? 'Success Stories' : 'قصص النجاح')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              {t(language === 'en' ? 'See how we are transforming education staffing' : 'شاهد كيف نقوم بتحويل التوظيف التعليمي')}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                metric: '94%',
                label: t(language === 'en' ? 'Satisfaction Rate' : 'معدل الرضا'),
                desc: t(language === 'en' ? 'Of schools report improved staffing efficiency' : ' تحسن في كفاءة التوظيف')
              },
              {
                metric: t(language === 'en' ? '15min' : '15دقيقة'),
                label: t(language === 'en' ? 'Average Match Time' : 'متوسط وقت المطابقة'),
                desc: t(language === 'en' ? 'To find qualified substitute teachers' : 'للعثور على معلمين بدلاء مؤهلين')
              },
              {
                metric: '50k+',
                label: t(language === 'en' ? 'Classrooms Covered' : 'الفصول المغطاة'),
                desc: t(language === 'en' ? 'Successfully staffed throughout the year' : 'تم توظيفها بنجاح على مدار العام')
              }
            ].map((story, index) => (
              <div key={index} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 
                             rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg
                             border border-gray-100 dark:border-gray-700">
                  <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 
                               bg-clip-text text-transparent mb-4">
                    {story.metric}
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{story.label}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{story.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white dark:bg-black overflow-hidden">
        <div className="max-w-[980px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              {t(language === 'en' ? 'What People Say' : 'ماذا يقول الناس')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              {t(language === 'en' ? 'Hear from our community of teachers and schools' : 'اسمع من مجتمعنا من المعلمين والمدارس')}
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                quote: t(language === 'en' ? 
                  'The platform made it incredibly easy to find teaching opportunities that match my schedule. I love the flexibility!' : 
                  'جعلت المنصة من السهل للغاية العثور على فرص تدريس تناسب جدولي. أحب المرونة!'
                ),
                author: "Sarah Johnson",
                role: t(language === 'en' ? 'Substitute Teacher' : 'معلم بديل'),
                rating: 5
              },
              {
                quote: t(language === 'en' ? 
                  'As a principal, this platform has revolutionized how we handle substitute teacher staffing. Highly recommended!' :
                  'كمدير مدرسة، غيرت هذه المنصة طريقة تعاملنا مع توظيف المعلمين البدلاء. أنصح بها بشدة!'
                ),
                author: "Michael Chen",
                role: t(language === 'en' ? 'School Principal' : 'مدير مدرسة'),
                rating: 5
              }
            ].map((testimonial, index) => (
              <div key={index} className="relative">
                <div className="absolute -top-4 -left-4 text-blue-600/10 dark:text-blue-400/10">
                  <Quote className="w-16 h-16" />
                </div>
                <div className="relative bg-gray-50 dark:bg-gray-800 p-8 rounded-xl">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-lg mb-6 italic">
                    "{testimonial.quote}"
                  </p>
                  <div>
                    <div className="font-semibold">{testimonial.author}</div>
                    <div className="text-gray-600 dark:text-gray-400">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-[980px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              {t(language === 'en' ? 'Frequently Asked Questions' : 'الأسئلة الشائعة')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              {t(language === 'en' ? 'Find answers to common questions about our platform' : 'اعثر على إجابات للأسئلة الشائعة حول منصتنا')}
            </p>
          </div>
          <div className="space-y-4">
            {[
              {
                q: t(language === 'en' ? 
                  'How do I get started as a substitute teacher?' : 
                  'كيف أبدأ كمعلم بديل؟'
                ),
                a: t(language === 'en' ? 
                  'Simply create an account, complete your profile with qualifications and preferences, and start browsing opportunities.' :
                  'ما عليك سوى إنشاء حساب، وإكمال ملفك الشخصي بالمؤهلات والتفضيلات، وبدء تصفح الفرص.'
                )
              },
              {
                q: t(language === 'en' ? 
                  'What qualifications do I need?' :
                  'ما المؤهلات التي أحتاجها؟'
                ),
                a: t(language === 'en' ? 
                  'Requirements vary by school district, but generally include a teaching certificate or bachelor\'s degree and background check.' :
                  'تختلف المتطلبات حسب المنطقة التعليمية، ولكنها تشمل عادةً شهادة تدريس أو شهادة بكالوريوس وفحص خلفية.'
                )
              },
              {
                q: t(language === 'en' ? 
                  'How quickly can I start teaching?' :
                  'ما مدى سرعة بدء التدريس؟'
                ),
                a: t(language === 'en' ? 
                  'Once your profile is approved and verified, you can start accepting assignments immediately.' :
                  'بمجرد الموافقة على ملفك الشخصي والتحقق منه، يمكنك البدء في قبول المهام على الفور.'
                )
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
                <button className="w-full px-6 py-4 flex items-center justify-between text-left">
                  <span className="font-medium">{faq.q}</span>
                  <Plus className="w-5 h-5 flex-shrink-0" />
                </button>
                <div className="px-6 pb-4">
                  <p className="text-gray-600 dark:text-gray-400">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16 bg-white dark:bg-black">
        <div className="max-w-[980px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            {[
              "https://placehold.co/200x80/667EEA/ffffff/png?text=Trust+Badge+1",
              "https://placehold.co/200x80/667EEA/ffffff/png?text=Trust+Badge+2",
              "https://placehold.co/200x80/667EEA/ffffff/png?text=Trust+Badge+3",
              "https://placehold.co/200x80/667EEA/ffffff/png?text=Trust+Badge+4"
            ].map((badge, index) => (
              <div key={index} className="flex items-center justify-center">
                <img 
                  src={badge} 
                  alt={`Trust Badge ${index + 1}`}
                  className="max-h-12 opacity-50 hover:opacity-100 transition-opacity duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-[980px] mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-4xl font-bold mb-8">
            {t('ctaTitle')}
          </h2>
          <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
            {t('ctaDescription')}
          </p>
          <button
            onClick={() => navigate('/login')}
            className="group px-8 py-4 bg-white text-blue-600 rounded-full
                     hover:bg-blue-50 transition-colors duration-300 flex items-center gap-2 mx-auto"
          >
            {t('getStarted')}
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-black py-12 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-[980px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              {
                title: t('company'),
                links: [
                  { label: t('about'), href: '#' },
                  { label: t('careers'), href: '#' },
                  { label: t('contact'), href: '#' }
                ]
              },
              {
                title: t('resources'),
                links: [
                  { label: t('blog'), href: '#' },
                  { label: t('guides'), href: '#' },
                  { label: t('help'), href: '#' }
                ]
              },
              {
                title: t('legal'),
                links: [
                  { label: t('privacy'), href: '#' },
                  { label: t('terms'), href: '#' }
                ]
              },
              {
                title: t('social'),
                links: [
                  { label: 'Twitter', href: '#' },
                  { label: 'LinkedIn', href: '#' },
                  { label: 'Facebook', href: '#' }
                ]
              }
            ].map((section, index) => (
              <div key={index}>
                <h4 className="text-sm font-semibold uppercase mb-4">
                  {section.title}
                </h4>
                <ul className="space-y-2">
                  {section.links.map((link, idx) => (
                    <li key={idx}>
                      <a href={link.href} className="text-gray-600 dark:text-gray-400 hover:text-blue-600 
                                                   dark:hover:text-blue-400 transition-colors duration-200">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              © 2024 SubTeacher Hub. {t('allRightsReserved')}
            </p>
          </div>
        </div>
      </footer>

      {/* Scroll Down Indicator */}
      <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 transition-opacity duration-300
                    ${scrolled ? 'opacity-0' : 'opacity-100'}`}>
        <ChevronDown className="w-6 h-6 text-gray-400 animate-bounce" />
      </div>
    </div>
  );
};

export default LandingPage; 