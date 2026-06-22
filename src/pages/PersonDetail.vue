<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useAlertUtils } from '@/utils/alert-utils'
import { UserInfoOutputModalRoleGroupsItem } from '@/generated/api/model'

const props = defineProps<{ isEdit?: boolean }>()
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { pushWarningAlert } = useAlertUtils()

const canEdit = computed(() => authStore.hasRole(UserInfoOutputModalRoleGroupsItem.HEAD_USER))

onMounted(() => {
  if (props.isEdit && !canEdit.value) {
    pushWarningAlert('Not allowed', 'You need the head-user role to edit persons.')
    router.replace({ name: 'Person', params: { id: route.params.id } })
  }
})
</script>