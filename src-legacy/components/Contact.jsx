const Contact = () => {
  return (
    <section className="py-20 bg-earth-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4" data-aos="fade-up">
            <img 
              src="/images/contact-icon.png" 
              alt="聯絡我們" 
              className="w-48 h-48"
            />
          </div>
          <h2 className="text-4xl font-bold text-earth-900 mb-4" data-aos="fade-up">聯絡我們</h2>
          <p className="text-xl text-earth-700" data-aos="fade-up" data-aos-delay="100">
            歡迎與我們聯繫，了解更多關於蘇格蘭㹴的資訊
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div 
            className="grid md:grid-cols-2 gap-8 items-center bg-white rounded-2xl shadow-xl overflow-hidden"
            data-aos="fade-up"
          >
            {/* 左側圖片 */}
            <div className="relative h-full min-h-[400px] bg-earth-100">
              <img
                src="/images/contact-scottie.png"
                alt="蘇格蘭㹴"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-earth-900/20 to-transparent"></div>
            </div>

            {/* 右側聯絡資訊 */}
            <div className="p-8 space-y-6">
                              <h3 className="text-2xl font-bold text-earth-900 mb-6">雷歐犬舍訓練工作室</h3>
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-earth-800">0912-345-678</span>
                </div>

                <div className="flex items-center space-x-3">
                  <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-earth-800">service@scottie.com</span>
                </div>

                <div className="flex items-start space-x-3">
                  <svg className="w-6 h-6 text-primary-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-earth-800">台中市北屯區崇德路二段46號</span>
                </div>

                <div className="flex items-center space-x-3">
                  <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-earth-800">營業時間：週一至週日 10:00-18:00</span>
                </div>

                <div className="pt-6 border-t border-earth-100">
                  <p className="text-earth-800 font-medium mb-4">社群媒體</p>
                  <div className="flex space-x-4">
                    <a 
                      href="https://facebook.com/scottie" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary-500 hover:text-primary-600 transition-colors"
                    >
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                      </svg>
                    </a>
                    <a 
                      href="https://instagram.com/scottie" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary-500 hover:text-primary-600 transition-colors"
                    >
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 1 0-2.5 0 1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"/>
                      </svg>
                    </a>
                    <a 
                      href="https://line.me/R/ti/p/@scottie" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary-500 hover:text-primary-600 transition-colors"
                    >
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19.365 9.863c.349 0 .63.285.631.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.193 0-.379-.078-.511-.217l-2.443-3.338v2.928c0 .346-.282.629-.631.629-.345 0-.63-.283-.63-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.075.507.215l2.462 3.338V8.108c0-.345.282-.63.63-.63.346 0 .63.285.63.63l-.007 4.771zm-3.088 0c0 .346-.282.629-.63.629-.345 0-.63-.283-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.771zm-2.906 0c0 .346-.282.629-.631.629H6.63c-.346 0-.63-.283-.63-.629V8.108c0-.345.284-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .63.283.63.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 底部裝飾元素 */}
        <div className="mt-16 text-center text-earth-600" data-aos="fade-up">
          <p>歡迎來電詢問，我們將為您提供最專業的服務</p>
        </div>
      </div>
    </section>
  );
};

export default Contact; 