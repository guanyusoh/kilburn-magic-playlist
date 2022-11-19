<template>
  <div class="tos-container pa-2" :class="$vuetify.breakpoint.mdAndDown ? 'mt-3' : 'mt-12'">
    <h1 :class="$vuetify.breakpoint.mdAndDown ? 'text-h4' : 'text-h3'" class="font-weight-bold mb-3">
      Terms of Service
    </h1>
    <h2 :class="$vuetify.breakpoint.mdAndDown ? 'text-h5' : 'text-h4'" class="font-weight-bold mt-5 mb-3">
      Introduction
    </h2>
    <p>These terms and conditions apply between you, the user of this website (including any sub-domains, unless expressly excluded by their own terms and conditions), and Z11, the owner and operator of this website. Please read these terms and conditions carefully, as they affect your legal rights. Your agreement to comply with and be bound by these terms and conditions is deemed to occur upon your first use of the website. If you do not agree to be bound by these terms and conditions, you should stop using the website immediately.</p>
    <p>In these terms and conditions, user or users means any third party that accesses the website and is not either (i) employed by Z11 and acting in the course of their employment or (ii) engaged as a consultant or otherwise providing services to Z11 and accessing the website in connection with the provision of such services. You must be at least 18 years of age to use this website. By using the website and agreeing to these terms and conditions, you represent and warrant that you are at least 18 years of age.</p>
    <h2 :class="$vuetify.breakpoint.mdAndDown ? 'text-h5' : 'text-h4'" class="font-weight-bold mt-5 mb-3">
      Intellectual Property and Acceptable Use
    </h2>
    <ol>
      <li>All content included on the website, unless uploaded by users, is the property of Z11, our affiliates or other relevant third parties. In these terms and conditions, content means any text, graphics, images, audio, video, software, data compilations, page layout, underlying code and software and any other form of information capable of being stored in a computer that appears on or forms part of this website, including any such content uploaded by users. By continuing to use the website you acknowledge that such content is protected by copyright, trademarks, database rights and other intellectual property rights. Nothing on this site shall be construed as granting, by implication, estoppel, or otherwise, any license or right to use any trademark, logo or service mark displayed on the site without the owner's prior written permission</li>
      <li>You must not otherwise reproduce, modify, copy, distribute or use for commercial purposes any content without the written permission of Z11.</li>
      <li>You acknowledge that you are responsible for any content you may submit via the website, including the legality, reliability, appropriateness, originality and copyright of any such content. You may not upload to, distribute or otherwise publish through the website any content that (i) is confidential, proprietary, false, fraudulent, libellous, defamatory, obscene, threatening, invasive of privacy or publicity rights, infringing on intellectual property rights, abusive, illegal or otherwise objectionable; (ii) may constitute or encourage a criminal offence, violate the rights of any party or otherwise give rise to liability or violate any law; or (iii) may contain software viruses, political campaigning, chain letters, mass mailings, or any form of "spam." You may not use a false email address or other identifying information, impersonate any person or entity or otherwise mislead as to the origin of any content. You may not upload commercial content onto the Website.</li>
      <li>You represent and warrant that you own or otherwise control all the rights to the content you post; that the content is accurate; that use of the content you supply does not violate any provision of these terms and conditions and will not cause injury to any person; and that you will indemnify Z11 for all claims resulting from content you supply.</li>
    </ol>
  </div>
</template>

<script>
export default {
  name: 'Tos',
  data () {
    return {
      user: false
    }
  },
  mounted () {
    if (localStorage.getItem('user')) {
      this.user = JSON.parse(localStorage.getItem('user')) || false
    }
    if (this.user !== false) {
      this.$store.commit('user/update', this.user)
    }
  }
}
</script>

<style lang="scss" scoped>
.tos-container {
  max-width: 1000px;
  margin: 0 auto;
}
</style>
