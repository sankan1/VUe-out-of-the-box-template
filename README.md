### Enforcing groups and roles

Gating actions taken

```
import { useAuthStore } from '@/stores/auth.store'
import { UserInfoOutputModalRoleGroupsItem } from '@/generated/api/model'

const authStore = useAuthStore()
const canEditPersons = computed(() => authStore.hasRole(UserInfoOutputModalRoleGroupsItem.HEAD_USER))
```

Visibility
```
@/permissions.ts

<button v-visible-to-head-user-group class="rounded bg-primary px-3 py-1 text-white" @click="goToEdit">
    Edit
</button>
```

### Test smart id code
40504040001