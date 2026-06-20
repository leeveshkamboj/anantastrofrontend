"use client";

import { useMemo, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useSelector } from "react-redux";
import { useGetChatAstrologersQuery } from "@/store/api/chatApi";
import { AstrologersHeroSection } from "@/components/astrologers/AstrologersHeroSection";
import { AstrologerFilterBar } from "@/components/astrologers/AstrologerFilterBar";
import { FeaturedAstrologersSection } from "@/components/astrologers/FeaturedAstrologersSection";
import { MainDirectorySection } from "@/components/astrologers/MainDirectorySection";
import { WhyExpertsSection } from "@/components/astrologers/WhyExpertsSection";
import { AstrologersCtaSection } from "@/components/astrologers/AstrologersCtaSection";
import { StartChatDialog } from "@/components/astrologers/StartChatDialog";
import {
  collectExpertiseOptions,
  DEFAULT_ASTROLOGER_FILTERS,
  filterAstrologers,
  splitFeaturedAndDirectory,
  type AstrologerFilters,
} from "@/lib/astrologer-utils";
import { selectToken } from "@/store/slices/authSlice";

export default function AstrologersPage() {
  const router = useRouter();
  const token = useSelector(selectToken);
  const { data, isLoading } = useGetChatAstrologersQuery();
  const [filters, setFilters] = useState<AstrologerFilters>(
    DEFAULT_ASTROLOGER_FILTERS,
  );
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [activeAstrologerId, setActiveAstrologerId] = useState<number | null>(
    null,
  );

  const astrologers = data?.data ?? [];
  const expertiseOptions = useMemo(
    () => collectExpertiseOptions(astrologers),
    [astrologers],
  );
  const filteredAstrologers = useMemo(
    () => filterAstrologers(astrologers, filters),
    [astrologers, filters],
  );
  const { featured, directory } = useMemo(
    () => splitFeaturedAndDirectory(filteredAstrologers),
    [filteredAstrologers],
  );
  const activeAstrologer = astrologers.find((a) => a.id === activeAstrologerId);

  const openStartChatDialog = (astrologerId: number) => {
    if (!token) {
      router.push(`/auth/login?next=${encodeURIComponent("/astrologers")}`);
      return;
    }
    setActiveAstrologerId(astrologerId);
    setShowProfileDialog(true);
  };

  return (
    <div className="overflow-x-hidden">
      <AstrologersHeroSection expertCount={astrologers.length} />
      <AstrologerFilterBar
        filters={filters}
        onChange={setFilters}
        expertiseOptions={expertiseOptions}
        resultCount={filteredAstrologers.length}
      />

      <div className="stars-bg">
        <FeaturedAstrologersSection
          astrologers={featured}
          onStartConsultation={openStartChatDialog}
        />
        <div className="bg-astro-dark pt-8">
          <MainDirectorySection
            astrologers={directory}
            isLoading={isLoading}
            onStartConsultation={openStartChatDialog}
          />
        </div>
      </div>

      <WhyExpertsSection />
      <AstrologersCtaSection />
      <StartChatDialog
        open={showProfileDialog}
        onOpenChange={setShowProfileDialog}
        activeAstrologer={activeAstrologer}
      />
    </div>
  );
}
