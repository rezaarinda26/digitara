import React, { useState, useEffect } from 'react';
import { useCMS } from '../context/CMSContext';
import { ArrowUpRight, Check, MapPin, Clock, Mail } from 'lucide-react';
import { EditableText, DraggableBox } from './editorial/Editable';
import { Reveal } from './common/Reveal';

export const Contact: React.FC = () => {
  const { data, addInquiry, isSectionLight, updateContact, updateConfig, darkBg, accentText } = useCMS();
  const { contact, config, theme } = data;
  const isLight = isSectionLight('contact');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    services: [] as string[],
    budget: '$5,000 - $10,000',
    message: '',
    agreed: true,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitted, setSubmitted] = useState(false);

  const availableServices = [
    'Logo & Visual Identity',
    'Web Design & Engineering',
    'UI/UX Product Design',
    'Motion & 3D Interactive',
    'Full-Stack Architecture',
  ];

  const budgetOptions = [
    '< $5,000',
    '$5,000 - $10,000',
    '$10,000 - $25,000',
    '$25,000+',
  ];

  // Listen to custom event from services section
  useEffect(() => {
    const handleServiceSelect = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      const selected = customEvent.detail;
      if (selected) {
        setFormData((prev) => ({
          ...prev,
          services: prev.services.includes(selected) ? prev.services : [...prev.services, selected],
        }));
      }
    };
    window.addEventListener('select-service', handleServiceSelect);
    return () => window.removeEventListener('select-service', handleServiceSelect);
  }, []);

  const toggleService = (srv: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(srv)
        ? prev.services.filter((s) => s !== srv)
        : [...prev.services, srv],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Please provide your first name';
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      newErrors.email = 'Please provide a valid work email';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Please provide a brief description of your project';
    }
    if (!formData.agreed) {
      newErrors.agreed = 'Please accept data consent';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    // Save lead to Headless CMS inquiries
    addInquiry({
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email,
      services: formData.services.length > 0 ? formData.services : ['General Inquiry'],
      budget: formData.budget,
      message: formData.message,
    });

    setSubmitted(true);
  };

  return (
    <section
      id="contact"
      className={`relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 transition-colors duration-500 ${
        isLight
          ? 'bg-white text-black border-t border-neutral-200'
          : 'text-white border-t border-white/[0.08]'
      }`}
      style={isLight ? undefined : { backgroundColor: darkBg }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Agency Information */}
          <Reveal variant="left" className="lg:col-span-5 flex">
            <div className="w-full flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest mb-4">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: theme.accentColor || (isLight ? '#0A0A0A' : '#FFFFFF') }}
                />
                <span className={isLight ? 'text-neutral-500' : 'text-neutral-400'}>
                  <EditableText
                    as="span"
                    value={contact.leftBadge}
                    onChange={(v) => updateContact({ leftBadge: v })}
                    label="Badge Contact"
                  />
                </span>
              </div>

              <EditableText
                as="h2"
                value={contact.headline}
                onChange={(v) => updateContact({ headline: v })}
                label="Headline Contact"
                className={`text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] ${
                  isLight ? 'text-neutral-950' : 'text-white'
                }`}
              />

              <p
                className={`mt-6 text-sm leading-relaxed font-light max-w-md ${
                  isLight ? 'text-neutral-600' : 'text-neutral-400'
                }`}
              >
                <EditableText
                  as="span"
                  value="Whether you have an upcoming project, redesigning an enterprise platform, or seeking a creative partner for brand evolution, our team is ready."
                  overrideKey="contact.intro"
                  label="Paragraf intro Contact"
                  multiline
                />
              </p>
            </div>

            {/* Direct Contact Metadata */}
            <div
              className={`mt-12 pt-8 border-t flex flex-col gap-5 text-sm ${
                isLight ? 'border-neutral-200' : 'border-white/[0.08]'
              }`}
            >
              <Reveal variant="up" delay={0}>
              <div className="flex items-start gap-3">
                <MapPin className={`w-4 h-4 mt-0.5 shrink-0 ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`} />
                <div>
                  <span className={`text-xs font-mono block ${isLight ? 'text-neutral-400' : 'text-neutral-300'}`}>
                    <EditableText as="span" value="Headquarters" overrideKey="contact.hqLabel" label="Label HQ" />
                  </span>
                  <EditableText
                    as="span"
                    value={config.location}
                    onChange={(v) => updateConfig({ location: v })}
                    label="Lokasi HQ"
                    className={`font-medium ${isLight ? 'text-neutral-900' : 'text-white'}`}
                  />
                </div>
              </div>
              </Reveal>

              <Reveal variant="up" delay={80}>
              <div className="flex items-start gap-3">
                <Clock className={`w-4 h-4 mt-0.5 shrink-0 ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`} />
                <div>
                  <span className={`text-xs font-mono block ${isLight ? 'text-neutral-400' : 'text-neutral-300'}`}>
                    <EditableText as="span" value="Availability" overrideKey="contact.availLabel" label="Label availability" />
                  </span>
                  <EditableText
                    as="span"
                    value={contact.workingHours}
                    onChange={(v) => updateContact({ workingHours: v })}
                    label="Jam kerja"
                    className={`font-light text-xs sm:text-sm ${isLight ? 'text-neutral-700' : 'text-neutral-300'}`}
                  />
                </div>
              </div>
              </Reveal>

              <Reveal variant="up" delay={160}>
              <div className="flex items-start gap-3">
                <Mail className={`w-4 h-4 mt-0.5 shrink-0 ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`} />
                <div>
                  <span className={`text-xs font-mono block ${isLight ? 'text-neutral-400' : 'text-neutral-300'}`}>
                    <EditableText as="span" value="Direct Inquiries" overrideKey="contact.inquiriesLabel" label="Label inquiries" />
                  </span>
                  <DraggableBox
                    as="a"
                    id="contact-email-link"
                    label="Email link"
                    href={`mailto:${config.email}`}
                    className="inline-block font-mono text-xs sm:text-sm hover:underline font-bold"
                    style={{ color: isLight ? theme.accentColor : accentText }}
                  >
                    <EditableText
                      as="span"
                      value={config.email}
                      onChange={(v) => updateConfig({ email: v })}
                      label="Email kontak"
                    />
                  </DraggableBox>
                </div>
              </div>
              </Reveal>
            </div>
            </div>
          </Reveal>

          {/* Right Column: Interactive Lead Capture Form */}
          <Reveal variant="right" className="lg:col-span-7 flex" delay={100}>
            <div
              className={`w-full p-8 sm:p-10 rounded-2xl border backdrop-blur-md ${
                isLight
                  ? 'bg-neutral-50/90 border-neutral-200 shadow-sm'
                  : 'bg-white/[0.02] border-white/[0.08]'
              }`}
            >
              <div className="mb-8">
                <span
                  className={`text-xs font-mono uppercase tracking-wider ${
                    isLight ? 'text-neutral-500' : 'text-neutral-400'
                  }`}
                >
                  <EditableText
                    as="span"
                    value={contact.rightBadge}
                    onChange={(v) => updateContact({ rightBadge: v })}
                    label="Badge form"
                  />
                </span>
                <EditableText
                  as="h3"
                  value={contact.formTitle}
                  onChange={(v) => updateContact({ formTitle: v })}
                  label="Judul form"
                  className={`text-2xl font-bold mt-1 ${isLight ? 'text-neutral-950' : 'text-white'}`}
                />
                <EditableText
                  as="p"
                  value={contact.formSubtitle}
                  onChange={(v) => updateContact({ formSubtitle: v })}
                  label="Subjudul form"
                  className={`text-xs mt-1 font-light ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}
                />
              </div>

              {submitted ? (
                <div className="py-12 flex flex-col items-center text-center animate-fade-in animate-zoom-in">
                  <div
                    className="w-16 h-16 rounded-full text-white flex items-center justify-center mb-6 shadow-md"
                    style={{ backgroundColor: theme.accentColor || '#0A0A0A' }}
                  >
                    <Check className="w-8 h-8" />
                  </div>
                  <h4 className={`text-2xl font-bold mb-2 ${isLight ? 'text-neutral-950' : 'text-white'}`}>
                    <EditableText as="span" value="Brief Received" overrideKey="contact.successTitle" label="Judul sukses" />
                  </h4>
                  <p className={`text-sm font-light max-w-md ${isLight ? 'text-neutral-600' : 'text-neutral-300'}`}>
                    <EditableText as="span" value="Thank you, " overrideKey="contact.successPrefix" label="Teks sukses awal" />
                    {formData.firstName}
                    <EditableText as="span" value=". Your project submission has been routed to our Lead Art Director. We will reply to " overrideKey="contact.successMid" label="Teks sukses tengah" />
                    <span className={`font-mono font-medium ${isLight ? 'text-black' : 'text-white'}`}>{formData.email}</span>
                    <EditableText as="span" value=" within 24 hours." overrideKey="contact.successSuffix" label="Teks sukses akhir" />
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        firstName: '',
                        lastName: '',
                        email: '',
                        services: [],
                        budget: '$5,000 - $10,000',
                        message: '',
                        agreed: true,
                      });
                    }}
                    className={`mt-8 px-6 py-2.5 rounded-lg text-xs font-medium transition-colors border ${
                      isLight
                        ? 'bg-white hover:bg-neutral-100 text-neutral-800 border-neutral-300'
                        : 'bg-white/10 hover:bg-white/20 text-white border-white/10'
                    }`}
                  >
                    <EditableText as="span" value="Submit Another Brief" overrideKey="contact.submitAnother" label="Teks submit ulang" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Split */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-xs font-mono mb-1.5 ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                        <EditableText as="span" value="First Name *" overrideKey="contact.label.firstName" label="Label nama depan" />
                      </label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        placeholder="e.g. Alex"
                        className={`w-full px-4 py-3 rounded-xl border text-sm placeholder-neutral-400 focus:outline-none transition-all ${
                          isLight
                            ? 'bg-white border-neutral-300 text-neutral-900 focus:border-black'
                            : 'bg-white/[0.04] border-white/10 text-white focus:ring-1 focus:ring-white'
                        } ${errors.firstName ? 'border-rose-500' : ''}`}
                      />
                      {errors.firstName && (
                        <span className="text-[11px] text-rose-500 mt-1 block">{errors.firstName}</span>
                      )}
                    </div>

                    <div>
                      <label className={`block text-xs font-mono mb-1.5 ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                        <EditableText as="span" value="Last Name" overrideKey="contact.label.lastName" label="Label nama belakang" />
                      </label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        placeholder="e.g. Morgan"
                        className={`w-full px-4 py-3 rounded-xl border text-sm placeholder-neutral-400 focus:outline-none transition-all ${
                          isLight
                            ? 'bg-white border-neutral-300 text-neutral-900 focus:border-black'
                            : 'bg-white/[0.04] border-white/10 text-white focus:ring-1 focus:ring-white'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Work Email */}
                  <div>
                    <label className={`block text-xs font-mono mb-1.5 ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                      <EditableText as="span" value="Work Email *" overrideKey="contact.label.email" label="Label email" />
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="alex@company.com"
                      className={`w-full px-4 py-3 rounded-xl border text-sm placeholder-neutral-400 focus:outline-none transition-all ${
                        isLight
                          ? 'bg-white border-neutral-300 text-neutral-900 focus:border-black'
                          : 'bg-white/[0.04] border-white/10 text-white focus:ring-1 focus:ring-white'
                      } ${errors.email ? 'border-rose-500' : ''}`}
                    />
                    {errors.email && (
                      <span className="text-[11px] text-rose-500 mt-1 block">{errors.email}</span>
                    )}
                  </div>

                  {/* Services Multi-Select */}
                  <div>
                    <label className={`block text-xs font-mono mb-2 ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                      <EditableText as="span" value="Services of Interest" overrideKey="contact.label.services" label="Label layanan" />
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {availableServices.map((srv, sIdx) => {
                        const isSelected = formData.services.includes(srv);
                        return (
                          <button
                            type="button"
                            key={srv}
                            onClick={() => toggleService(srv)}
                            className={`px-3 py-1.5 rounded-lg text-xs transition-all border ${
                              isSelected
                                ? 'text-white font-semibold shadow-sm'
                                : isLight
                                ? 'bg-white text-neutral-700 hover:text-black border-neutral-300'
                                : 'bg-white/[0.04] hover:bg-white/[0.08] text-neutral-400 border-white/5'
                            }`}
                            style={
                              isSelected
                                ? {
                                    backgroundColor: theme.accentColor || (isLight ? '#0A0A0A' : '#FFFFFF'),
                                    borderColor: theme.accentColor || (isLight ? '#0A0A0A' : '#FFFFFF'),
                                    color: theme.accentColor === '#FFFFFF' ? '#000000' : '#FFFFFF',
                                  }
                                : {}
                            }
                          >
                            {isSelected ? '✓ ' : '+ '}
                            <EditableText as="span" value={srv} overrideKey={`contact.srvOpt.${sIdx}`} label="Opsi layanan" />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Budget Selector */}
                  <div>
                    <label className={`block text-xs font-mono mb-2 ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                      <EditableText as="span" value="Estimated Project Investment" overrideKey="contact.label.budget" label="Label budget" />
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {budgetOptions.map((opt, bIdx) => {
                        const isBudgetSelected = formData.budget === opt;
                        return (
                          <button
                            type="button"
                            key={opt}
                            onClick={() => setFormData({ ...formData, budget: opt })}
                            className={`py-2 px-2 text-center rounded-lg text-xs font-mono transition-all border ${
                              isBudgetSelected
                                ? isLight
                                  ? 'bg-neutral-900 text-white border-neutral-900 font-semibold'
                                  : 'bg-white/20 text-white border-white/40 font-semibold'
                                : isLight
                                ? 'bg-white text-neutral-600 hover:text-black border-neutral-200'
                                : 'bg-white/[0.03] text-neutral-400 hover:text-white border-white/5'
                            }`}
                          >
                            <EditableText as="span" value={opt} overrideKey={`contact.budgetOpt.${bIdx}`} label="Opsi budget" />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className={`block text-xs font-mono mb-1.5 ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                      <EditableText as="span" value="Project Description *" overrideKey="contact.label.message" label="Label deskripsi" />
                    </label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us about your brand goals, target timeline, or challenges..."
                      className={`w-full px-4 py-3 rounded-xl border text-sm placeholder-neutral-400 focus:outline-none transition-all resize-none ${
                        isLight
                          ? 'bg-white border-neutral-300 text-neutral-900 focus:border-black'
                          : 'bg-white/[0.04] border-white/10 text-white focus:ring-1 focus:ring-white'
                      } ${errors.message ? 'border-rose-500' : ''}`}
                    />
                    {errors.message && (
                      <span className="text-[11px] text-rose-500 mt-1 block">{errors.message}</span>
                    )}
                  </div>

                  {/* Consent Checkbox */}
                  <div>
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.agreed}
                        onChange={(e) => setFormData({ ...formData, agreed: e.target.checked })}
                        className="mt-0.5 rounded border-neutral-400 text-black focus:ring-0"
                      />
                      <span className={`text-xs leading-tight ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                        <EditableText
                          as="span"
                          value={contact.consentText}
                          onChange={(v) => updateContact({ consentText: v })}
                          label="Teks consent"
                          multiline
                        />
                      </span>
                    </label>
                    {errors.agreed && (
                      <span className="text-[11px] text-rose-500 mt-1 block">{errors.agreed}</span>
                    )}
                  </div>

                  {/* Submit Button */}
                  <DraggableBox
                    as="button"
                    id="contact-submit"
                    label="Tombol submit"
                    type="submit"
                    className="w-full group flex items-center justify-center gap-2 py-4 rounded-xl text-white font-semibold text-sm transition-all duration-300 active:scale-98 shadow-xl hover:brightness-110 cursor-pointer"
                    style={{
                      backgroundColor: theme.accentColor || '#6B5CE7',
                      color: theme.accentColor === '#FFFFFF' ? '#000000' : '#FFFFFF',
                      boxShadow: `0 10px 30px ${theme.accentColor || '#6B5CE7'}40`,
                    }}
                  >
                    <EditableText
                      as="span"
                      value={contact.submitButtonText}
                      onChange={(v) => updateContact({ submitButtonText: v })}
                      label="Teks tombol submit"
                    />
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </DraggableBox>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};
